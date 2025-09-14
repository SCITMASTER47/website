import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      return NextResponse.redirect(
        new URL("/auth/signin?error=oauth_error", request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=no_code", request.url)
      );
    }

    // TODO: Google OAuth 토큰 교환 및 사용자 인증 로직 구현
    console.log("Google OAuth code:", code);
    console.log("State:", state);

    // 성공 시 메인 페이지로 리다이렉트
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=server_error", request.url)
    );
  }
}
