import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";
import { ApiError } from "@/lib/api-errors";
import { requireCsrfToken } from "@/lib/csrf";
import { requireRateLimit, RateLimitPresets } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Apply strict rate limiting for auth endpoints
    const rateLimitResult = requireRateLimit(request, RateLimitPresets.AUTH);
    if (rateLimitResult?.error) {
      return ApiError.rateLimit(rateLimitResult.error.message, rateLimitResult.error.headers);
    }

    // Validate CSRF token
    const csrfValid = await requireCsrfToken(request);
    if (!csrfValid) {
      return ApiError.csrf();
    }

    // Extract and verify Firebase token
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
      return ApiError.unauthorized();
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    logger.info({ userId, email }, "POST /api/users - User authenticated");

    if (!email) {
      return ApiError.validation("Email not found in token");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (existingUser) {
      logger.info({ userId }, "POST /api/users - User already exists");
      return NextResponse.json({ user: existingUser });
    }

    // Create new user in database
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: email,
      },
    });

    logger.info({ userId, email }, "POST /api/users - User created successfully");

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    if (error.code === "auth/id-token-expired") {
      return ApiError.unauthorized("Token expired");
    }
    return ApiError.internal("Error creating user");
  }
}
