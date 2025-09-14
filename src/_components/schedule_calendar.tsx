"use client";

import { useState } from "react";
import Calendar, { CalendarData } from "@/_ui/calendar";
import { MonthlySchedule } from "@/_types/schedule";

interface StudyCalendarProps {
  studyPlan: MonthlySchedule;
}

export default function StudyCalendar({ studyPlan }: StudyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const onMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // studyPlan을 CalendarData 형식으로 변환
  const studyData: CalendarData = Object.keys(studyPlan).reduce(
    (acc, dateKey) => {
      acc[dateKey] = studyPlan[dateKey].map((item) => ({
        title: item.subject,
        content: item.duration.toString(),
      }));
      return acc;
    },
    {} as CalendarData
  );

  return (
    <Calendar
      currentMonth={currentMonth}
      selectedDate={selectedDate}
      onDateSelect={onDateSelect}
      onMonthChange={onMonthChange}
      calendarData={studyData}
    />
  );
}
