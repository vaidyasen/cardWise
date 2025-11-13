import { cookies } from "next/headers";
import { randomBytes } from "crypto";

/**
 * CSRF Protection Utility
 * 
 * Implements Double Submit Cookie pattern for CSRF protection.
 * Tokens are stored in HTTP-only cookies and must match the token sent in request headers.
 */

const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";

/**
 * Generates a cryptographically secure CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Sets a CSRF token in an HTTP-only cookie
 * Should be called when rendering pages that will make state-changing requests
 */
export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken();
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });
  
  return token;
}

/**
 * Gets the current CSRF token from cookies
 */
export async function getCsrfToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value;
}

/**
 * Validates CSRF token from request headers against cookie value
 * Returns true if valid, false otherwise
 */
export async function validateCsrfToken(request: Request): Promise<boolean> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  
  if (!cookieToken || !headerToken) {
    return false;
  }
  
  // Constant-time comparison to prevent timing attacks
  return timingSafeEqual(
    Buffer.from(cookieToken),
    Buffer.from(headerToken)
  );
}

/**
 * Timing-safe string comparison
 */
function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  
  return result === 0;
}

/**
 * Middleware helper for API routes to validate CSRF tokens
 * Only validates for state-changing methods (POST, PUT, DELETE, PATCH)
 */
export async function requireCsrfToken(request: Request): Promise<boolean> {
  const method = request.method.toUpperCase();
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  
  // Skip CSRF validation for safe methods
  if (safeMethods.includes(method)) {
    return true;
  }
  
  return await validateCsrfToken(request);
}

/**
 * Gets the CSRF token header name for client-side requests
 */
export function getCsrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}
