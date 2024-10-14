import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const url = req.nextUrl.clone();

 
  if (url.pathname.startsWith("/singlepost")) {
  
    if (!token) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  }


  return NextResponse.next();
}


export const config = {
  matcher: ["/singlepost/:path*"],
};
