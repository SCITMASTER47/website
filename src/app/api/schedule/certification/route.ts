import { Certification } from "@/_types/schedule";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return NextResponse.json({ status: "ok", data: tempCertifications });
    }

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

//export interface Certification {
//   id: string;
//   title: string;
//   description: string;
//   subjects: Subject[];
//   imgUrl?: string;
// }
const tempCertifications: Certification[] = [
  {
    id: "1",
    title: "基本情報技術者試験",
    description: "基本情報技術者試験の説明",
    subjects: [],
    imgUrl: "",
  },
  {
    id: "2",
    title: "応用情報技術者試験",
    description: "応用情報技術者試験の説明",
    subjects: [],
    imgUrl: "",
  },
  {
    id: "5",
    title: "応用情報技術者試験",
    description: "応用情報技術者試験の説明",
    subjects: [],
    imgUrl: "",
  },
  {
    id: "3",
    title: "応用情報技術者試験",
    description: "応用情報技術者試験の説明",
    subjects: [],
    imgUrl: "",
  },
  {
    id: "4",
    title: "応用情報技術者試験",
    description: "応用情報技術者試験の説明",
    subjects: [],
    imgUrl: "",
  },
];
