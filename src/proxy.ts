import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check auth session for protected routes
  const session = await auth();

  if (!session) {
    const signInUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files, images, favicon, and api/auth
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
