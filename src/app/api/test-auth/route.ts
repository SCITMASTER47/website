import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // 테스트용 인증 정보 반환
    const testAuthInfo = {
      authenticated: true,
      user: {
        id: "test-user-123",
        email: "test@example.com",
        name: "테스트 사용자",
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(testAuthInfo);
  } catch (error) {
    console.error("Test auth API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 테스트용 로그인 처리
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 간단한 테스트 인증 (실제 구현에서는 데이터베이스 검증 필요)
    if (email === "test@example.com" && password === "password") {
      const authResponse = {
        success: true,
        token: "test-jwt-token-12345",
        user: {
          id: "test-user-123",
          email: "test@example.com",
          name: "테스트 사용자",
        },
      };

      return NextResponse.json(authResponse);
    } else {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Test auth POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
