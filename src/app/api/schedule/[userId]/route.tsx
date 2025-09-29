// userId로 스케줄 가져오기 routehandler
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return NextResponse.json({ status: "ok", data: [] });
    }

    const token = request.headers.get("authorization");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/schedules/users/${userId}`,
      {
        method: "GET",
        headers: {
          ...(token && { Authorization: token }),
        },
      }
    );
    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch {
    console.log("error");
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
