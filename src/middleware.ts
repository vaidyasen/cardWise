import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");

  // List of paths that require authentication
  const protectedPaths = ["/cards", "/search", "/insights", "/profile"];

  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !authCookie) {
    // Redirect to sign in page if trying to access protected route without auth
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (
    (request.nextUrl.pathname === "/signin" ||
      request.nextUrl.pathname === "/signup") &&
    authCookie
  ) {
    // Redirect to cards page if trying to access auth pages while already authenticated
    return NextResponse.redirect(new URL("/cards", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cards/:path*",
    "/search/:path*",
    "/insights/:path*",
    "/profile/:path*",
    "/signin",
    "/signup",
  ],
};
