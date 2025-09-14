import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");
    const body = await request.json();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/daily-todos/completion`,
      {
        method: "PUT",
        headers: {
          ...(token && { Authorization: token }),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
