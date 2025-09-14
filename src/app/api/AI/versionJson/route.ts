import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 버전 정보 반환
    const versionInfo = {
      version: "1.0.0",
      buildDate: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };

    return NextResponse.json(versionInfo);
  } catch (error) {
    console.error("Version API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
