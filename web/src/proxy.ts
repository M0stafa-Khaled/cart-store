import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/next-auth/auth";
import { Role } from "./interfaces";

const publicRoutes = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/error",
];

const protectedRoutes = ["/dashboard", "/profile", "/cart", "/checkout"];

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl;
  const params = req.nextUrl.searchParams;
  const isAuthenticated = !!req.auth;
  const userRole = req.auth?.user?.role as Role;
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isSessionExpired = params.get("error") === "SessionExpired";

  if (isAuthenticated && pathname.startsWith("/auth/") && !isSessionExpired) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // authenticated routes require authentication
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?callbackUrl=${encodeURIComponent(`${pathname}?${params}`)}`,
        req.url
      )
    );
  }

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated)
      return NextResponse.redirect(
        new URL(
          `/auth/sign-in?callbackUrl=${encodeURIComponent(`${pathname}?${params}`)}`,
          req.url
        )
      );

    if (userRole !== "ADMIN")
      return NextResponse.redirect(new URL("/not-found", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
