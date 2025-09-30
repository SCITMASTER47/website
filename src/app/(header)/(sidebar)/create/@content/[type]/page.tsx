import BookSelectStep from "@/_components/create/BookSelectStep";
import CertificationStep from "@/_components/create/certification_step";
import ExamDateStep from "@/_components/create/ExamDateStep";
import TimeSelectPage from "@/_components/create/TimeSelectPage";
import SubjectLevelStep from "@/_components/create/SubjectLevelStep";
import {
  BookSelectSkeleton,
  CertificationSkeleton,
} from "@/_components/create/LoadingSkeleton";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function CreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await params;
  const { searchName } = await searchParams;

  if (type === "certification")
    return (
      <Suspense fallback={<CertificationSkeleton />}>
        <CertificationStep />
      </Suspense>
    );
  if (type === "date") return <ExamDateStep />;
  if (type === "book")
    return (
      <Suspense fallback={<BookSelectSkeleton />}>
        <BookSelectStep
          searchName={typeof searchName === "string" ? searchName : undefined}
        />
      </Suspense>
    );
  if (type === "time") return <TimeSelectPage />;
  if (type === "confirm") return <SubjectLevelStep />;
  return notFound();
}
