"use client";

import { ScheduleDetailResponse } from "@/_types/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import { Button } from "@/_ui/button";
import {
  CalendarIcon,
  BookOpenIcon,
  AwardIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ScheduleHeaderProps {
  schedule: ScheduleDetailResponse;
  todoCount: number;
}

export default function ScheduleHeader({
  schedule,
  todoCount,
}: ScheduleHeaderProps) {
  const router = useRouter();

  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const createdDate = new Date(schedule.createdAt);

  // 자격증 레벨 추출
  const getCertificationLevel = (title: string) => {
    const levelMatch = title.match(/(\d급|N\d|Level\s?\d)/i);
    return levelMatch ? levelMatch[0] : null;
  };

  const level = getCertificationLevel(schedule.certificateInfo?.title || "");

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          뒤로가기
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {schedule.summary}
                </CardTitle>
                {level && (
                  <Badge variant="secondary" className="text-sm font-semibold">
                    <AwardIcon className="w-4 h-4 mr-1" />
                    {level}
                  </Badge>
                )}
              </div>

              {/* 자격증 정보 */}
              <div className="flex items-center gap-2 mb-4">
                <AwardIcon className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-medium text-gray-800">
                  {/* {schedule.certificateInfo.title} */}
                </span>
              </div>

              {/* 교재 정보 */}
              {schedule.readBookDTO && (
                <div className="flex items-center gap-2 mb-4">
                  <BookOpenIcon className="w-5 h-5 text-green-600" />
                  <span className="text-base text-gray-700">
                    {schedule.readBookDTO.title}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {schedule.readBookDTO.companyName}
                  </Badge>
                </div>
              )}

              {/* 날짜 및 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    {startDate.toLocaleDateString("ko-KR")} -{" "}
                    {endDate.toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-sm">
                    총 {todoCount}개 할일
                  </Badge>
                  {schedule.totalPages && (
                    <Badge variant="outline" className="text-sm">
                      {schedule.totalPages} 페이지
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* 메타 정보 */}
            <div className="text-right space-y-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">스케줄 ID</div>
                <Badge variant="outline" className="font-mono text-xs">
                  {schedule.id}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">생성일</div>
                <div className="text-sm text-gray-600">
                  {createdDate.toLocaleDateString("ko-KR")}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">버전</div>
                <Badge variant="secondary" className="text-xs">
                  {schedule.versionId}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
