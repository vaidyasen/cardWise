import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import logger from "@/lib/logger";

/**
 * Request logging middleware
 * Logs all API requests with timing, status, and user context
 */

interface RequestLog {
  method: string;
  path: string;
  duration: number;
  status: number;
  userId?: string;
  ip?: string;
  userAgent?: string;
}

/**
 * Extract user ID from Firebase token if present
 */
async function extractUserId(request: NextRequest): Promise<string | undefined> {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return undefined;
    }

    // We don't decode the token here to avoid importing firebase-admin in middleware
    // The actual validation happens in API routes
    // This is just for logging purposes
    return "authenticated"; // Simplified - actual userId extracted in API routes
  } catch {
    return undefined;
  }
}

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string | undefined {
  // Try various headers in order of preference
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to unknown if no IP headers present
  return "unknown";
}

/**
 * Create a logging wrapper for API routes
 * Use this in your API route handlers
 */
export async function withRequestLogging(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  context?: { userId?: string }
): Promise<NextResponse> {
  const startTime = Date.now();
  const method = request.method;
  const path = new URL(request.url).pathname;
  const userAgent = request.headers.get("user-agent") || "unknown";
  const ip = getClientIp(request);

  try {
    // Execute the actual handler
    const response = await handler();
    const duration = Date.now() - startTime;
    const status = response.status;

    // Log successful requests
    const logData: RequestLog = {
      method,
      path,
      duration,
      status,
      userId: context?.userId,
      ip,
      userAgent,
    };

    if (status >= 400) {
      logger.warn(logData, `${method} ${path} - ${status}`);
    } else {
      logger.info(logData, `${method} ${path} - ${status}`);
    }

    // Add timing header to response
    response.headers.set("X-Response-Time", `${duration}ms`);

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;

    // Log errors
    logger.error(
      {
        method,
        path,
        duration,
        status: 500,
        userId: context?.userId,
        ip,
        userAgent,
        error,
      },
      `${method} ${path} - Error`
    );

    throw error;
  }
}

/**
 * Simplified logging function for quick use
 * Logs request details without wrapping the handler
 */
export function logRequest(
  method: string,
  path: string,
  status: number,
  duration: number,
  userId?: string
): void {
  const logData = {
    method,
    path,
    status,
    duration,
    userId,
  };

  if (status >= 400) {
    logger.warn(logData, `${method} ${path} - ${status} (${duration}ms)`);
  } else {
    logger.info(logData, `${method} ${path} - ${status} (${duration}ms)`);
  }
}
