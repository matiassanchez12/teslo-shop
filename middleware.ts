import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const session: any = await getToken({ req, secret });

  const { protocol, host, pathname } = req.nextUrl;

  const validRoles = ["admin", "super-user", "seo"];
  const protectedRoutes = ["/admin/dashboard", "/admin/orders", "/admin/users", "/admin/products"];

  if(pathname.startsWith("/api/")) {
    if (!session) {
      return NextResponse.redirect(`${protocol}//${host}/api/auth/unauthorized`);
    }
  }

  if (protectedRoutes.includes(pathname)) {
    if (!session || (session && !validRoles.includes(session.user.role))) {
      return NextResponse.redirect(`${protocol}//${host}/api/auth/unauthorized`);
    }
  }

  if (!session && pathname === "/admin") {
    return NextResponse.redirect(`${protocol}//${host}/`);
  }

  if (session && !validRoles.includes(session.user.role) && pathname === "/admin") {
    return NextResponse.redirect(`${protocol}//${host}/`);
  }

  if (!session && pathname === "/checkout/address") {
    return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin", "/api/admin/dashboard"]
};
