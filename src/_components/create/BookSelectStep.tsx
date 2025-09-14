"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import CertifyLogo from "@/_ui/logo/logo";
import { Card, CardContent } from "@/_ui/card";
import { Input } from "@/_ui/input";
import { Book } from "@/_types/schedule";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export interface BookSelectStepProps {
  books: Book[];
}
export default function BookSelectStep({ books }: BookSelectStepProps) {
  const router = useRouter();
  // onChange 될 때마다 searchParam의 searchName 변경
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = e.target.value;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("searchName", searchName);
    router.replace(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const { formData, loading, handleBookSelect } = useCreateScheduleStore();

  useEffect(() => {
    if (formData.licenseId) {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("cid", formData.licenseId);
      router.replace(`${window.location.pathname}?${searchParams.toString()}`);
    }
  }, [formData.licenseId, router]);
  const handleSelect = (book: Book) => {
    const nextUrl = handleBookSelect(book);
    router.replace(nextUrl);
  };

  return loading ? (
    <div className="flex flex-col grow h-full justify-center items-center">
      <CertifyLogo loading={loading} />
      <p className="text-xs text-gray-500 font-bold">책 정보를 가져오는중</p>
    </div>
  ) : (
    <CardContent className="flex flex-col grow p-0">
      <Input placeholder="책 제목 검색" onChange={onChange} className="" />
      <div className="w-full h-auto grid grid-cols-2 md:grid-cols-5 gap-4 p-2 overflow-y-auto">
        {books.map((book) => (
          <Card
            key={book.id}
            className={`cursor-pointer  h-32 flex flex-col items-center justify-center transition-all shadow-sm hover:scale-95 active:scale-90 ${
              formData.bookId === book.id && "ring-2 ring-primary"
            }`}
            onClick={() => handleSelect(book)}
          >
            <CardContent className="p-2 flex flex-col items-center">
              {/* <Image
                src={book.}
                alt={book.title}
                width={128}
                height={160}
                className="mb-2 rounded object-cover"
                style={{ width: "8rem", height: "10rem" }}
              /> */}
              <div className="font-semibold text-center text-sm">
                {book.title}
              </div>
              <div className="text-xs text-gray-500">{book.company_name}</div>
            </CardContent>
          </Card>
        ))}
        {books.length === 0 && (
          <div className="text-gray-400">검색 결과가 없습니다.</div>
        )}
      </div>
    </CardContent>
  );
}
