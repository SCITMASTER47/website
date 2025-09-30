"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import { BookOpenIcon, SearchIcon, BuildingIcon } from "lucide-react";

export function BookSelectSkeleton() {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* 검색 헤더 스켈레톤 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            <CardTitle>교재 선택</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-300" />
            <div className="h-10 bg-gray-200 rounded-md animate-pulse pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* 책 목록 스켈레톤 */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="group transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center space-y-3">
                    {/* 책 이미지 스켈레톤 */}
                    <div className="w-full aspect-[3/4] rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="text-gray-400">
                        <svg
                          className="w-12 h-12"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* 책 정보 스켈레톤 */}
                    <div className="w-full space-y-2">
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto" />
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <BuildingIcon className="h-3 w-3 text-gray-400" />
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>

                      <div className="flex justify-center">
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>

                    {/* 선택 버튼 스켈레톤 */}
                    <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CertificationSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          <div>
            <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 인기 자격증 섹션 스켈레톤 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* 아이콘 스켈레톤 */}
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl animate-pulse flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-400 rounded" />
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* 제목 스켈레톤 */}
                    <div className="h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />

                    {/* 설명 스켈레톤 */}
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
                    </div>

                    {/* 통계 스켈레톤 */}
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-gray-200 rounded animate-pulse" />
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 전체 자격증 섹션 스켈레톤 */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <Card key={index} className="transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* 이미지 스켈레톤 */}
                  <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                    <div className="w-8 h-8 bg-gray-400 rounded" />
                  </div>

                  {/* 제목 스켈레톤 */}
                  <div className="space-y-1 w-full">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3 mx-auto" />
                  </div>

                  {/* 버튼 스켈레톤 */}
                  <div className="w-full h-9 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
