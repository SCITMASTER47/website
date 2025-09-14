import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { name } = await request.json();
  return NextResponse.json({ message: `Hello ${name}` });
}

export async function POST(request: NextRequest) {
  const { name } = await request.json();
  return NextResponse.json({ message: `Hello ${name}` });
}

export async function PUT(request: NextRequest) {
  const { name } = await request.json();
  return NextResponse.json({ message: `Updated ${name}` });
}
export async function DELETE(request: NextRequest) {
  const { name } = await request.json();
  return NextResponse.json({ message: `Deleted ${name}` });
}
