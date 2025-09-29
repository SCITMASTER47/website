import { NextRequest, NextResponse } from "next/server";
// scheduleId로 스케줄 가져오기
export async function GET(request: NextRequest) {
  try {
    const scheduleId = request.nextUrl.searchParams.get("scheduleId");

    if (!scheduleId) {
      return NextResponse.json(
        { status: 400, message: "Bad Request: Missing scheduleId" },
        { status: 400 }
      );
    }
    const token = request.headers.get("authorization");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/${scheduleId}`,
      {
        method: "GET",
        // cache: "no-store",
        // next: { tags: ["schedule"] },
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
