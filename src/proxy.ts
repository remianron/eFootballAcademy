import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

/**
 * Admin route guard (Next 16 proxy — the renamed middleware).
 * Every /admin request (page renders and server-action POSTs) requires
 * a valid signed session cookie; unauthenticated requests are sent to
 * the sign-in page. The login route itself redirects already-authenticated
 * users into the admin area.
 */
export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
