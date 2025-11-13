/**
 * Rate Limiting Utility
 * 
 * Implements in-memory rate limiting with sliding window algorithm.
 * For production with multiple instances, consider using Redis-based solution like @upstash/ratelimit
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests allowed in the window
}

interface RequestLog {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// Note: This will reset when the server restarts
// For production with multiple instances, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RequestLog>();

/**
 * Default rate limit configurations
 */
export const RateLimitPresets = {
  // Strict limits for authentication endpoints
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  // Moderate limits for general API endpoints
  API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60, // 60 requests per minute
  },
  // Lenient limits for read-only endpoints
  READ: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
} as const;

/**
 * Gets client identifier from request
 * Uses IP address and User-Agent for fingerprinting
 */
function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  // Combine IP and user agent for better uniqueness
  return `${ip}:${userAgent.substring(0, 50)}`;
}

/**
 * Cleans up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Checks if a request should be rate limited
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): { allowed: boolean; remaining: number; resetTime: number; limit: number } {
  // Use provided identifier or generate one from request
  const clientId = identifier || getClientIdentifier(request);
  const now = Date.now();
  
  // Periodically clean up expired entries (1% chance on each check)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }
  
  const existing = rateLimitStore.get(clientId);
  
  // No existing record or expired window - create new
  if (!existing || now > existing.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(clientId, {
      count: 1,
      resetTime,
    });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
      limit: config.maxRequests,
    };
  }
  
  // Increment count in existing window
  existing.count++;
  rateLimitStore.set(clientId, existing);
  
  const allowed = existing.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - existing.count);
  
  return {
    allowed,
    remaining,
    resetTime: existing.resetTime,
    limit: config.maxRequests,
  };
}

/**
 * Rate limit middleware helper for API routes
 * Returns null if allowed, or error response if rate limited
 */
export function requireRateLimit(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): { error?: { message: string; headers: Record<string, string> } } | null {
  const result = checkRateLimit(request, config, identifier);
  
  // Add rate limit headers for client visibility
  const headers = {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
  };
  
  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    return {
      error: {
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
        headers: {
          ...headers,
          "Retry-After": retryAfter.toString(),
        },
      },
    };
  }
  
  // Return null if allowed (no error)
  return null;
}

/**
 * Resets rate limit for a specific client (useful for testing or admin actions)
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Gets current rate limit status for a client
 */
export function getRateLimitStatus(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): { count: number; remaining: number; resetTime: number } | null {
  const clientId = identifier || getClientIdentifier(request);
  const existing = rateLimitStore.get(clientId);
  
  if (!existing || Date.now() > existing.resetTime) {
    return null;
  }
  
  return {
    count: existing.count,
    remaining: Math.max(0, config.maxRequests - existing.count),
    resetTime: existing.resetTime,
  };
}
