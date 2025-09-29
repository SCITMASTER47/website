"use client";

import { useState, useRef } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

import { ko } from "date-fns/locale/ko";

import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";

export interface CalendarItem {
  title: string;
  content: string;
  isDone: boolean;
}

export interface CalendarData {
  [dateKey: string]: CalendarItem[];
}

export interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  calendarData?: CalendarData;
  getSubjectColor?: (subject: string) => string;
}

export default function Calendar({
  currentMonth,
  selectedDate,
  onDateSelect,
  onMonthChange,
  calendarData,
  getSubjectColor = (subject: string) => {
    const colors = {
      "문자·어휘": "bg-blue-500",
      문법: "bg-green-500",
      독해: "bg-purple-500",
      청해: "bg-orange-500",
      모의고사: "bg-red-500",
    };
    return colors[subject as keyof typeof colors] || "bg-gray-500";
  },
}: CalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    placement: "left" as "left" | "right" | "top" | "bottom",
  });
  const calendarRef = useRef<HTMLDivElement>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // 월요일부터 시작하는 주의 시작과 끝을 구함
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // 캘린더에 표시할 모든 날짜들 (이전 달, 현재 달, 다음 달 포함)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const calculateTooltipPosition = (dayElement: HTMLElement) => {
    if (!dayElement || !calendarRef.current) return;

    const dayRect = dayElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipWidth = 384; // w-96
    const tooltipHeight = 384; // h-96

    let placement: "left" | "right" | "top" | "bottom" = "left";
    let x = dayRect.left;
    let y = dayRect.top;

    // 왼쪽에 공간이 있는지 확인
    if (dayRect.left >= tooltipWidth + 10) {
      placement = "left";
      x = dayRect.left - tooltipWidth - 8;
      y = dayRect.top;
    }
    // 오른쪽에 공간이 있는지 확인
    else if (dayRect.right + tooltipWidth + 10 <= viewportWidth) {
      placement = "right";
      x = dayRect.right + 8;
      y = dayRect.top;
    }
    // 아래쪽에 공간이 있는지 확인
    else if (dayRect.bottom + tooltipHeight + 10 <= viewportHeight) {
      placement = "bottom";
      x = dayRect.left;
      y = dayRect.bottom + 8;
    }
    // 위쪽에 배치
    else {
      placement = "top";
      x = dayRect.left;
      y = dayRect.top - tooltipHeight - 8;
    }

    // 화면 경계 조정
    if (x < 10) x = 10;
    if (x + tooltipWidth > viewportWidth - 10)
      x = viewportWidth - tooltipWidth - 10;
    if (y < 10) y = 10;
    if (y + tooltipHeight > viewportHeight - 10)
      y = viewportHeight - tooltipHeight - 10;

    setTooltipPosition({ x, y, placement });
  };

  const handleMouseEnter = (
    day: Date,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setHoveredDay(day);
    calculateTooltipPosition(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const getStudyForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return calendarData ? calendarData[dateKey] || [] : [];
  };

  return (
    <>
      <Card className="p-0" ref={calendarRef}>
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {format(currentMonth, "yyyy년 M월", { locale: ko })}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMonthChange(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMonthChange(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const studyItems = getStudyForDate(day);
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentMonth);

              return (
                <div
                  key={day.toString()}
                  className={`relative min-h-[80px] p-1 border rounded cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-100 border-blue-300"
                      : isCurrentMonth
                      ? "bg-white border-gray-200 hover:bg-gray-50"
                      : "bg-gray-50 border-gray-100"
                  }`}
                  onClick={() => onDateSelect(day)}
                  onMouseEnter={(e) =>
                    isCurrentMonth &&
                    studyItems.length > 0 &&
                    handleMouseEnter(day, e)
                  }
                  onMouseLeave={handleMouseLeave}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    } ${!isCurrentMonth ? "opacity-50" : ""}`}
                  >
                    {format(day, "d")}
                  </div>

                  {/* 현재 달의 날짜에만 일정 표시 */}
                  {isCurrentMonth && (
                    <div className="flex flex-col gap-1">
                      {studyItems.slice(0, 2).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 overflow-hidden"
                          title={`${item.title} (${item.content}분)`}
                        >
                          <div
                            className={`flex-shrink-0 h-1 w-1 rounded text-xs ${
                              item.isDone ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                          <span className="flex-1 text-[8px] truncate">
                            {item.title}
                          </span>
                        </div>
                      ))}
                      {studyItems.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{studyItems.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 포털을 사용한 동적 위치 툴팁 */}
      {hoveredDay && (
        <div
          className="fixed w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
          }}
        >
          <div className="text-sm font-semibold mb-2 text-gray-800">
            {format(hoveredDay, "M월 d일 학습 계획", { locale: ko })}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {getStudyForDate(hoveredDay).map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.isDone ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-xs">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.content}분</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
