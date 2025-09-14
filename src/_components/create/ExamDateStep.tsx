"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import Calendar from "../../_ui/calendar";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExamDateStep() {
  const { formData, handleExamDateChange } = useCreateScheduleStore();

  const selectedDate = useMemo(() => {
    return formData.examDate ? new Date(formData.examDate) : new Date();
  }, [formData.examDate]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const router = useRouter();
  useEffect(() => {
    if (formData.examDate) {
      const examDate = new Date(formData.examDate);
      setCurrentMonth(examDate);
    }
  }, [formData.examDate]);
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
