import { NextResponse } from "next/server";
import logger from "./logger";

/**
 * Standard error codes for API responses
 */
export enum ErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  FORBIDDEN = "FORBIDDEN",
  CSRF_ERROR = "CSRF_ERROR",
  RATE_LIMIT = "RATE_LIMIT",
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  code: ErrorCode;
  details?: unknown;
}

/**
 * Create a standardized error response
 * Logs the error server-side and returns safe message to client
 */
export function createErrorResponse(
  message: string,
  code: ErrorCode,
  status: number,
  error?: unknown,
  details?: unknown,
  headers?: Record<string, string>
): NextResponse<ErrorResponse> {
  // Log error server-side with full context
  if (error) {
    logger.error({ error, code, status }, message);
  } else {
    logger.warn({ code, status }, message);
  }

  // Return safe error response to client
  const response: ErrorResponse = {
    error: message,
    code,
  };
  
  if (details !== undefined) {
    response.details = details;
  }
  
  return NextResponse.json<ErrorResponse>(response, { 
    status,
    headers: headers || {}
  });
}

/**
 * Common error response helpers
 */
export const ApiError = {
  unauthorized: (message = "Unauthorized") =>
    createErrorResponse(message, ErrorCode.UNAUTHORIZED, 401),

  validation: (message: string, details?: unknown) =>
    createErrorResponse(message, ErrorCode.VALIDATION_ERROR, 400, undefined, details),

  notFound: (resource = "Resource") =>
    createErrorResponse(`${resource} not found`, ErrorCode.NOT_FOUND, 404),

  forbidden: (message = "Forbidden") =>
    createErrorResponse(message, ErrorCode.FORBIDDEN, 403),

  csrf: (message = "Invalid or missing CSRF token") =>
    createErrorResponse(message, ErrorCode.CSRF_ERROR, 403),

  rateLimit: (message: string, headers: Record<string, string>) =>
    createErrorResponse(message, ErrorCode.RATE_LIMIT, 429, undefined, undefined, headers),

  internal: (error?: unknown, message = "Internal server error") =>
    createErrorResponse(message, ErrorCode.INTERNAL_ERROR, 500, error),

  database: (error: unknown, message = "Database operation failed") =>
    createErrorResponse(message, ErrorCode.DATABASE_ERROR, 500, error),
};
