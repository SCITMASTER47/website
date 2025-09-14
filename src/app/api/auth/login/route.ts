import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log(process.env.NEXT_PUBLIC_NODE_ENV);
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      const jwt =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NCIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTc1NTc1ODQ3MiwiZXhwIjoxNzU2NjIyNDcyfQ.yD9KM6D4eQOtOl26hkwRvHM5ZbR442_n7YadU0632vM";
      const response = NextResponse.json({ jwt }, { status: 200 });
      response.cookies.set("jwt", jwt, {
        path: "/",
        httpOnly: false, // 클라이언트 JS에서 접근 가능
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일
      });
      return response;
    }
    // 실제 백엔드 서버에 로그인 요청
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!backendRes.ok) {
      const error = await backendRes.json();
      return NextResponse.json(
        { error: error.message || "로그인 실패" },
        { status: backendRes.status }
      );
    }
    const data = await backendRes.json();

    const jwt = data.data.accessToken;
    // jwt를 쿠키에 저장
    const response = NextResponse.json({ jwt }, { status: 200 });

    response.cookies.set("jwt", jwt, {
      path: "/",
      httpOnly: false, // 클라이언트 JS에서 접근 가능
      secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
    });
    return response;
  } catch {
    return NextResponse.json({ error: "로그인 처리 중 오류" }, { status: 500 });
  }
}
