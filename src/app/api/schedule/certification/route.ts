import { Certification } from "@/_types/schedule";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = request.headers.get("authorization");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/certification`,
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
