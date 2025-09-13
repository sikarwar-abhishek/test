import { NextResponse } from "next/server";

export function middleware(request) {
  const testing = false;
  if (testing) return NextResponse.next();

  const { pathname } = request.nextUrl;

  const token = request.cookies.get("authToken")?.value;

  const protectedRoutes = [
    "/home",
    "/challenges",
    "/lounge",
    "/myprofile",
    "/practice",
  ];
  const publicRoutes = ["/login", "/"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  if (!token) {
    if (isProtectedRoute) {
      const signinUrl = new URL("/login", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }
  }

  if (token) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
