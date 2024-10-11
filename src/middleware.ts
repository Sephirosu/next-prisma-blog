import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Get token from the request using next-auth's getToken method
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const url = req.nextUrl.clone();

  // Check if the user is trying to access a protected route like `/singlePost`
  if (url.pathname.startsWith("/singlepost")) {
    // If the user is not authenticated, redirect them to the login page
    if (!token) {
      url.pathname = "/sign-in"; // Redirect to the login page
      return NextResponse.redirect(url);
    }
  }

  // If the user is authenticated, continue to the requested route
  return NextResponse.next();
}

// Define which paths should use this middleware (apply it only to the singlePost route)
export const config = {
  matcher: ["/singlepost/:path*"],
};
