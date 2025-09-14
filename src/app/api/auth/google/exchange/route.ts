import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // TODO: Google OAuth 토큰 교환 로직 구현
    // 실제 구현 시 Google OAuth 2.0 엔드포인트에 요청하여 액세스 토큰을 받아야 함

    console.log("Exchanging code for token:", code);

    // 임시 응답 (실제 구현 필요)
    const tokenResponse = {
      access_token: "temp_access_token",
      refresh_token: "temp_refresh_token",
      expires_in: 3600,
      token_type: "Bearer",
    };

    return NextResponse.json(tokenResponse);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
