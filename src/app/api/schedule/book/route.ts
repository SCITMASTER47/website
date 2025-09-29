import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const certificateId = searchParams.get("certificateId");
    const token = request.headers.get("authorization");

    if (!certificateId) {
      throw new Error("certificateId is required");
    }
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/certificates/${certificateId}/books`,
      {
        method: "GET",
        headers: {
          ...(token && { Authorization: token }),
        },
      }
    );

    const resJson = await res.json();

    return NextResponse.json(resJson);
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
