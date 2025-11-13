import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Extract and verify Firebase token
    const token = request.headers.get("Authorization")?.split("Bearer ")[1];
    
    if (!token) {
      logger.warn("POST /api/users - No authorization token");
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;
    const email = decodedToken.email;

    logger.info({ userId, email }, "POST /api/users - User authenticated");

    if (!email) {
      logger.warn({ userId }, "POST /api/users - Email not found in token");
      return NextResponse.json(
        { error: "Email not found in token" },
        { status: 400 }
      );
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
    logger.error({ error }, "POST /api/users - Error creating user");
    
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Token expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
