import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ year: string; month: string }> }
) {
  try {
    const { year, month } = await params;

    const token = request.headers.get("authorization");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/calendar/${year}/${month}`,
      {
        method: "GET",
        cache: "no-store",
        next: { tags: ["todo"] },
        headers: {
          ...(token && { Authorization: token }),
        },
      }
    );
    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch (error) {
    console.log("error", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
