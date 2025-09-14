import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/study-plans?page=1&size=10&sort=updatedAt.desc`,
      {
        method: "GET",
        cache: "force-cache",
        next: { tags: ["getSchedules"] },
      }
    );
    const resJson = await res.json();
    return NextResponse.json(resJson);
  } catch {
    console.log("error");
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
