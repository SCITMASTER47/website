import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  try {
    const { date } = await params;
    const token = request.headers.get("authorization");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/todo/getByDate?date=${date}`,
      {
        method: "GET",
        cache: "force-cache",
        headers: {
          ...(token && { Authorization: token }),
        },
        next: { tags: ["todo", `todo${date}`] },
      }
    );

    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
