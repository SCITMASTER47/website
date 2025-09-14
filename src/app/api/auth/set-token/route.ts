import { checkValidateJwtOnServer } from "@/_utils/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("Set-token API called");
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 400 });
    }

    // 토큰 유효성 검사
    await checkValidateJwtOnServer(token);

    // 쿠키 설정과 함께 응답 생성
    const response = NextResponse.json({ success: true });

    response.cookies.set("jwt", token, {
      path: "/",
      httpOnly: false, // 클라이언트 JS에서 접근 가능
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    console.log("JWT 쿠키 설정 완료");
    return response;
  } catch (error) {
    console.error("JWT 쿠키 설정 실패:", error);
    return NextResponse.json(
      { error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}
