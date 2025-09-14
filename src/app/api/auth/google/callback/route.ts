import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const queryParams = request.nextUrl.searchParams;
    const jwt = queryParams.get("token");
    console.log("Google OAuth callback received, token:", jwt);
    if (jwt) {
      const response = NextResponse.redirect(
        new URL("/", "http://localhost:3000")
      );
      response.cookies.set("jwt", jwt, {
        path: "/",
        httpOnly: false, // 클라이언트 JS에서 접근 가능
        secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
      return response;
    } else {
      console.log("No token found in callback");
      return NextResponse.redirect(new URL("http://localhost:3000/signup"));
    }
  } catch (error) {
    console.log("Error in Google OAuth callback", error);
    return NextResponse.redirect(new URL("http://localhost:3000/signup"));
  }
}
