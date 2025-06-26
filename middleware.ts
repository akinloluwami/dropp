import { NextRequest, NextResponse } from "next/server";

const SESSION_NAME = "dropp-auth-token";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/api/snippets"];

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ["/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if route is auth route (login)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get session token from cookies
  const sessionToken = request.cookies.get(SESSION_NAME)?.value;

  if (sessionToken) {
    // For stateful sessions, we'll let the server-side handle validation
    // The middleware just checks if a token exists
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard/snippets", request.url));
    }

    // Allow access to protected routes
    return NextResponse.next();
  } else {
    // No session token
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
