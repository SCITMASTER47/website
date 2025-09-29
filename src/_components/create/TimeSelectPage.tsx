"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/_ui/card";
import { useRouter } from "next/navigation";
import { useCreateScheduleStore } from "@/_store/createSchedule";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function TimeSelectPage() {
  const { handleClickDateTimeNext } = useCreateScheduleStore();
  const router = useRouter();
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>(
    {}
  );

  // 시작하면 cookie에 저장된 정보를 바탕으로 state초기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // 자격증 정보 가져오기
        const availableDaysCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_available_days="))
          ?.split("=")[1];

        if (availableDaysCookie) {
          const availableDaysData = JSON.parse(
            decodeURIComponent(availableDaysCookie)
          );
          if (availableDaysData) {
            setSelectedTimes({ ...availableDaysData, total: 0 });
          } else {
            setSelectedTimes({});
          }
        } else {
          // 자격증 정보가 없으면 빈 배열 설정
          setSelectedTimes({});
        }
      } catch (error) {
        console.error("Failed to load data from cookies:", error);
      }
    }
  }, []);

  const handleTimeSelect = (day: string, hours: number) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [day]: hours,
    }));
  };

  const handleSubmit = () => {
    handleClickDateTimeNext({
      ...selectedTimes,
      total: totalHours / (Object.keys(selectedTimes).length || 1),
    });
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
            <div key={day} className="flex items-center gap-4">
              <div className="w-8 text-center text-md font-bold block">
                {day}
              </div>
              <div className="flex-1">
                <TimeBar
                  day={day}
                  selectedHours={selectedTimes[day] || 0}
                  onTimeSelect={handleTimeSelect}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium">
              <span className="text-purple-600">{totalHours}시간</span>
            </div>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700"
              onClick={handleSubmit}
            >
              다음
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface TimeBarProps {
  day: string;
  selectedHours: number;
  onTimeSelect: (day: string, hours: number) => void;
}

function TimeBar({ day, selectedHours, onTimeSelect }: TimeBarProps) {
  const hours = Array.from({ length: 25 }, (_, i) => i); // 0부터 24까지

  return (
    <div className="w-fit flex flex-col">
      <div className="flex gap-1">
        {hours.map((hour) => (
          <button
            key={hour}
            onClick={() => onTimeSelect(day, hour)}
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
            title={hour === 0 ? "공부 안함" : `${hour}시간`}
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
