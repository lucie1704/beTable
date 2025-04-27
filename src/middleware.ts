import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (token?.role === "Administrateur") {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path',
    '/_next/data/:path/admin/:subpath*'
  ]
};