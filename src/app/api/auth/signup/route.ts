import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!backendRes.ok) {
      const error = await backendRes.json();
      return NextResponse.json(
        { message: error.message || "회원가입 실패" },
        { status: backendRes.status }
      );
    }
    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "회원가입 처리 중 오류" },
      { status: 500 }
    );
  }
}
