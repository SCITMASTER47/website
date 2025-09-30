"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/_ui/card";
import { useRouter } from "next/navigation";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import { AvailableDayInfo } from "@/_types/schedule";

const DAYS = [
  { label: "월", value: "MON" },
  { label: "화", value: "TUE" },
  { label: "수", value: "WED" },
  { label: "목", value: "THU" },
  { label: "금", value: "FRI" },
  { label: "토", value: "SAT" },
  { label: "일", value: "SUN" },
];

export default function TimeSelectPage() {
  const {
    availableDays,
    handleClickDateTimeNext,
    selectedCertification,
    selectedBook,
    examDate,
  } = useCreateScheduleStore();
  const router = useRouter();
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>(
    {}
  );

  // store에서 기존 선택된 시간 정보 가져오기
  useEffect(() => {
    if (availableDays.length > 0) {
      const timesMap = availableDays.reduce((acc, dayInfo) => {
        acc[dayInfo.day] = dayInfo.hour;
        return acc;
      }, {} as Record<string, number>);
      setSelectedTimes(timesMap);
    }
  }, [availableDays]);

  // 유효성 검사: 이전 단계가 완료되었는지 확인
  useEffect(() => {
    if (!selectedCertification || !selectedBook || !examDate) {
      router.push("/create/certification");
    }
  }, [selectedCertification, selectedBook, examDate, router]);

  const handleTimeSelect = (dayValue: string, hours: number) => {
    const newTimes = {
      ...selectedTimes,
      [dayValue]: hours,
    };

    // 0시간인 경우 해당 요일 제거
    if (hours === 0) {
      delete newTimes[dayValue];
    }

    setSelectedTimes(newTimes);

    // store에 실시간 업데이트
    const dayInfo: AvailableDayInfo = {
      day: dayValue,
      hour: hours,
    };
    handleClickDateTimeNext(dayInfo);
  };

  const handleSubmit = () => {
    router.push("/create/confirm");
  };

  const totalHours = Object.values(selectedTimes).reduce(
    (sum, hours) => sum + hours,
    0
  );

  return (
    <div className="h-full w-full ">
      <Card className="p-6">
        <div className="space-y-2">
          {DAYS.map((day) => (
            <div key={day.value} className="flex items-center gap-4">
              <div className="w-8 text-center text-md font-bold block">
                {day.label}
              </div>
              <div className="flex-1">
                <TimeBar
                  dayValue={day.value}
                  dayLabel={day.label}
                  selectedHours={selectedTimes[day.value] || 0}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">
              <span className="text-purple-600">총 {totalHours}시간</span>
              {Object.keys(selectedTimes).length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (주 {Object.keys(selectedTimes).length}일)
                </span>
              )}
            </div>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                totalHours > 0
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSubmit}
              disabled={totalHours === 0}
            >
              다음 단계
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface TimeBarProps {
  dayValue: string;
  dayLabel: string;
  selectedHours: number;
  onTimeSelect: (dayValue: string, hours: number) => void;
}

function TimeBar({
  dayValue,
  dayLabel,
  selectedHours,
  onTimeSelect,
}: TimeBarProps) {
  const hours = Array.from({ length: 25 }, (_, i) => i); // 0부터 24까지

  return (
    <div className="w-fit flex flex-col">
      <div className="flex gap-1">
        {hours.map((hour) => (
          <button
            key={hour}
            onClick={() => onTimeSelect(dayValue, hour)}
            className={`
               group w-6 h-8 rounded-sm transition-all duration-200 hover:scale-110 flex items-center justify-center
              ${
                selectedHours === 0
                  ? hour === 0
                    ? "bg-gray-300 hover:bg-gray-400"
                    : "bg-gray-200 hover:bg-gray-300"
                  : hour <= selectedHours
                  ? hour === 0
                    ? "bg-gray-200 hover:bg-gray-300"
                    : "bg-purple-500 hover:bg-purple-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }
            `}
            title={
              hour === 0 ? `${dayLabel} 공부 안함` : `${dayLabel} ${hour}시간`
            }
          >
            <span
              className={`${
                selectedHours === 0 || selectedHours != hour
                  ? "invisible"
                  : "visible"
              } group-hover:visible text-xs font-medium text-white`}
            >
              {hour}h
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>0h</span>
        <span>12h</span>
        <span>24h</span>
      </div>
    </div>
  );
}
