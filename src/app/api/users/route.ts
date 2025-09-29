import { NextRequest, NextResponse } from "next/server";
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization");

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
      method: "GET",
      headers: {
        ...(token && { Authorization: token }),
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      return NextResponse.json(
        { status: res.status, message: "Failed to fetch users" },
        { status: res.status }
      );
    }
    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
