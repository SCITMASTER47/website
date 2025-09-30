"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Input } from "@/_ui/input";
import { Badge } from "@/_ui/badge";
import { Button } from "@/_ui/button";
import { Book } from "@/_types/schedule";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getAllBooks } from "@/_action-server/schedule";
import {
  BookOpenIcon,
  SearchIcon,
  BuildingIcon,
  ImageIcon,
} from "lucide-react";

export interface BookSelectStepProps {
  searchName?: string;
}

export default function BookSelectStep({ searchName }: BookSelectStepProps) {
  const router = useRouter();
  const { handleBookSelect, selectedCertification } = useCreateScheduleStore();
  const [searchTerm, setSearchTerm] = useState(searchName || "");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!selectedCertification) {
        router.push("/create/certification");
        return;
      }

      try {
        setIsDataLoading(true);
        const data = await getAllBooks(selectedCertification.id);
        setBooks(data);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCertification, router]);

  const handleSelect = async (book: Book) => {
    setIsLoading(true);
    setSelectedBook(book);

    try {
      const nextUrl = handleBookSelect(book);
      router.replace(nextUrl);
    } catch (error) {
      console.error("Failed to select book:", error);
      setSelectedBook(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchName = e.target.value;
    setSearchTerm(searchName);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("searchName", searchName);
    router.replace(`${window.location.pathname}?${searchParams.toString()}`);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 향후 출판사별 그룹화 기능을 위한 준비 코드 (현재는 미사용)
  // const groupedBooks = filteredBooks.reduce((acc, book) => {
  //   const company = book.company_name;
  //   if (!acc[company]) {
  //     acc[company] = [];
  //   }
  //   acc[company].push(book);
  //   return acc;
  // }, {} as Record<string, Book[]>);

  if (isDataLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">교재 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 검색 헤더 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            <CardTitle>교재 선택</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="secondary">{filteredBooks.length}권 검색됨</Badge>
              {filteredBooks.length !== books.length && (
                <Badge variant="outline" className="text-xs">
                  전체 {books.length}권
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="책 제목이나 출판사명으로 검색하세요..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
              autoFocus
            />
          </div>
        </CardContent>
      </Card>

      {/* 책 목록 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                    selectedBook?.id === book.id
                      ? "ring-2 ring-primary shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleSelect(book)}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center space-y-3">
                      {/* 책 이미지 또는 플레이스홀더 */}
                      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center relative">
                        {book.imgUrl ? (
                          <Image
                            src={book.imgUrl}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            onError={() => {
                              console.log("Image failed to load:", book.imgUrl);
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ImageIcon className="h-8 w-8 mb-2" />
                            <span className="text-xs">이미지 없음</span>
                          </div>
                        )}
                      </div>

                      {/* 책 정보 */}
                      <div className="w-full space-y-2">
                        <h3
                          className="font-semibold text-sm text-center leading-tight min-h-[2.5rem] overflow-hidden group-hover:text-primary transition-colors"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                          title={book.title} // 호버 시 전체 제목 표시
                        >
                          {book.title}
                        </h3>

                        <div className="flex items-center justify-center gap-1 text-xs text-black">
                          <BuildingIcon className="h-3 w-3" />
                          <span className="truncate" title={book.companyName}>
                            {book.companyName}
                          </span>
                        </div>

                        {/* 추가 정보 (hover 시 표시) */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Badge variant="outline" className="text-xs">
                            ID: {book.id}...
                          </Badge>
                        </div>
                      </div>

                      {/* 선택 버튼 */}
                      <Button
                        variant={
                          selectedBook?.id === book.id ? "default" : "outline"
                        }
                        size="sm"
                        className="w-full"
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelect(book);
                        }}
                      >
                        {isLoading && selectedBook?.id === book.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>처리 중...</span>
                          </div>
                        ) : selectedBook?.id === book.id ? (
                          "선택됨"
                        ) : (
                          "선택하기"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm text-muted-foreground">
                다른 키워드로 검색해보세요
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
