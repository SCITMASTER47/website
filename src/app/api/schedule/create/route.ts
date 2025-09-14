import { ScheduleCreateRequest } from "@/components/global/schedule";
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
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      const response = {
        plan_id: "sp_20250821_001",
        license_id: "03",
        exam_date: "2025-08-27",
        timezone: "Asia/Seoul",
        generated_tasks: [
          {
            task_id: "t1",
            date: "2025-08-24",
            subject: "청해",
            title: "실전 청해 2세트",
            expected_minutes: 90,
            time_block: "AFTERNOON",
          },
          {
            task_id: "t2",
            date: "2025-08-31",
            subject: "독해",
            title: "독해 지문 연습",
            expected_minutes: 60,
            time_block: "AFTERNOON",
          },
        ],
        summary: {
          total_days: 32,
          total_expected_hours: 118,

          coverage: { 청해: 45, 청독해: 38, 독해: 35 },
        },
        created_at: "2025-08-21T09:32:10+09:00",
      };
      return NextResponse.json({
        status: 200,
        message: "create success",
        data: response,
      });
    }
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
