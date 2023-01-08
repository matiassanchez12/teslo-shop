import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // @ts-ignore
  const session: any = await getToken({ req, secret });

  // console.log(process.env.GITHUB_ID, process.env.NEXTAUTH_SECRET);
  const { protocol, host, pathname } = req.nextUrl;

  const validRoles = ["admin", "super-user", "seo"];

  if (pathname === "/api/admin/dashboard") {
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
  matcher: ["/checkout/:path*", "/orders/:path*", "/admin", "/api/admin/dashboard"],
};
