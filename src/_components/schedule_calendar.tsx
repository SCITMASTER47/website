"use client";

import { useState, useEffect, useCallback } from "react";
import Calendar, { CalendarData } from "@/_ui/calendar";
import { MonthlySchedule, TodoProps } from "@/_types/schedule";
import { getMonthlySchedules } from "@/_action-server/schedule";

//  const studyplan = await getMonthlySchedules(2025, 9); // 예시: 2023년 10월 데이터 가져오기
export default function StudyCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [studyData, setStudyData] = useState<CalendarData>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 월별 스케줄 데이터를 가져오는 함수
  const fetchMonthlySchedule = useCallback(
    async (year: number, month: number) => {
      setLoading(true);
      setError(null);

      try {
        // 서버 액션을 통해 실제 데이터 가져오기
        const data = await getMonthlySchedules(year, month);

        const calendarData: CalendarData = {};

        data.forEach((schedule: MonthlySchedule) => {
          const date = schedule.date; // 'YYYY-MM-DD' 형식
          if (!calendarData[date]) {
            calendarData[date] = [];
          }
          schedule.todos.forEach((todo) => {
            calendarData[date].push({
              title: todo.chapter || "학습",
              content: String(todo.minute),
              isDone: todo.isDone,
            });
          });
        });

        setStudyData(calendarData);
      } catch (err) {
        console.error("Failed to fetch monthly schedule:", err);
        setError(
          err instanceof Error
            ? err.message
            : "스케줄 데이터를 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 초기 로드 및 월 변경 시 데이터 가져오기
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1
    fetchMonthlySchedule(year, month);
  }, [currentMonth, fetchMonthlySchedule]);

  const onDateSelect = async (date: Date) => {
    setSelectedDate(date);

    // 선택된 날짜의 상세 정보를 콘솔에 출력 (추후 모달이나 사이드바에 표시 가능)
    const dateString = date.toISOString().split("T")[0];
    const dayData = studyData[dateString];

    if (dayData && dayData.length > 0) {
      console.log(`Selected date: ${dateString}`, dayData);
      // 여기에 모달 열기나 사이드바 표시 로직을 추가할 수 있습니다
    } else {
      console.log(`No schedule data for ${dateString}`);
    }
  };

  const onMonthChange = (date: Date) => {
    setCurrentMonth(date);
    // useEffect에서 자동으로 새 데이터를 가져옴
  };

  // 과목별 색상 지정
  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      "소프트웨어 설계": "bg-blue-500",
      "데이터베이스 구축": "bg-green-500",
      "프로그래밍 언어 활용": "bg-purple-500",
      "정보시스템 구축관리": "bg-orange-500",
      "소프트웨어 개발": "bg-red-500",
    };
    return colorMap[subject] || "bg-gray-500";
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <button
          onClick={() => {
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;
            fetchMonthlySchedule(year, month);
          }}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">
              데이터 로딩 중...
            </span>
          </div>
        </div>
      )}

      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={onDateSelect}
        onMonthChange={onMonthChange}
        calendarData={studyData}
        getSubjectColor={getSubjectColor}
      />
    </div>
  );
}
