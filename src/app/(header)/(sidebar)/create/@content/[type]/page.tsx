import { getAllBooks, getAllCertificates } from "@/_action-server/schedule";
import BookSelectStep from "@/_components/create/BookSelectStep";
import CertificationStep from "@/_components/create/certification_step";
import ExamDateStep from "@/_components/create/ExamDateStep";
import TimeSelectPage from "@/_components/create/TimeSelectPage";
import { Book } from "@/_types/schedule";
import SubjectLevelStep from "@/_ui/SubjectLevelStep";
import { notFound } from "next/navigation";

export default async function CreatePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await params;
  const { cid, searchName } = await searchParams;

  if (type === "certification") return <Certification />;
  if (type === "date") return <Date />;
  if (type === "book")
    return <BookPage certificateId={cid} searchName={searchName} />;
  if (type === "time") return <TimePage />;
  if (type === "confirm") return <ConfirmPage />;
  return notFound();
}

async function Certification() {
  const certifications = await getAllCertificates();
  return <CertificationStep certifications={certifications} />;
}

async function Date() {
  return <ExamDateStep />;
}

async function BookPage({
  certificateId,
  searchName,
}: {
  certificateId: string | string[] | undefined;
  searchName: string | string[] | undefined;
}) {
  const books: Book[] = await getAllBooks(
    typeof certificateId === "string" ? certificateId : ""
  ).then((books) => {
    // searchName이 있으면 필터링
    if (typeof searchName === "string" && searchName.trim() !== "") {
      return books.filter((book) =>
        book.title.toLowerCase().includes(searchName.toLowerCase())
      );
    }
    return books;
  });
  return <BookSelectStep books={books} />;
}
async function TimePage() {
  return <TimeSelectPage />;
}
async function ConfirmPage() {
  return <SubjectLevelStep />;
}
