import { NextResponse } from "next/server";
import { setCsrfToken } from "@/lib/csrf";

/**
 * GET /api/csrf
 * Returns a CSRF token for the client to use in subsequent requests
 * The token is also set in an HTTP-only cookie
 */
export async function GET() {
  try {
    const token = await setCsrfToken();
    
    return NextResponse.json({ 
      token,
      headerName: "x-csrf-token"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}
