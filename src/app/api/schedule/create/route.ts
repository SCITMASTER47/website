import { ScheduleCreateRequest } from "@/_types/schedule";
import { NextRequest, NextResponse } from "next/server";

/**
 *
 * @param request  ScheduleCreateForm
 * @param response
 * @returns
 */
export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get("jwt");

    const data: ScheduleCreateRequest = await request.json();

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/scehdule/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    return NextResponse.json({
      status: backendRes.status,
      message: "create success",
      data: await backendRes.json(),
    });
  } catch {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
