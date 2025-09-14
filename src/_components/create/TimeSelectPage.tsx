"use client";
import React, { useState } from "react";
import { Button } from "@/_ui/button";
import { Card } from "@/_ui/card";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function TimeSelectPage() {
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number>>(
    {}
  );

  const handleTimeSelect = (day: string, hours: number) => {
    setSelectedTimes((prev) => ({
      ...prev,
      [day]: hours,
    }));
  };

  const handleSubmit = () => {
    // 선택된 시간 데이터를 서버로 전송
    console.log("Selected times:", selectedTimes);
    // TODO: 서버 액션 호출
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
              <div className="w-8 text-center font-medium text-gray-700">
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
              총 학습 시간:{" "}
              <span className="text-blue-600">{totalHours}시간</span>
            </div>
            <Button onClick={handleSubmit} disabled={totalHours === 0}>
              설정 완료
            </Button>
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
                    ? "bg-red-500 hover:bg-red-600"
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
