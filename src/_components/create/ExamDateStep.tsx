"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import Calendar from "../../_ui/calendar";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function ExamDateStep() {
  const { handleExamDateChange } = useCreateScheduleStore();

  const selectedDate = useMemo(() => {
    return new Date();
  }, []);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();

  const handleDateSelect = (date: Date) => {
    const nextUrl = handleExamDateChange(date);
    router.replace(nextUrl);
  };
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };
  return (
    <div className="w-full h-full">
      <Calendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}
