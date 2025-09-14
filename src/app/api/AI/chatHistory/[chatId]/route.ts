import { NextRequest, NextResponse } from "next/server";

//
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await params;
    const token = request.headers.get("authorization");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai/schedules/sessions/${chatId}/chat-history`,
      {
        method: "GET",
        headers: {
          ...(token && { Authorization: token }),
        },
        // cache: "force-cache",
      }
    );

    const resJson = await res.json();
    if (resJson.status !== "ok") {
      throw new Error("Failed to fetch versions");
    }
    return NextResponse.json(resJson);
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
