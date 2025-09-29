import { WeekDay } from "@/_types/schedule";

export const timeSlots = [
  { id: "morning", label: "오전 (6-12시)", value: "morning" },
  { id: "afternoon", label: "오후 (12-18시)", value: "afternoon" },
  { id: "evening", label: "저녁 (18-24시)", value: "evening" },
];

export const weekdays: WeekDay[] = [
  { id: "MON", label: "월요일", value: "MON" },
  { id: "TUE", label: "화요일", value: "TUE" },
  { id: "WED", label: "수요일", value: "WED" },
  { id: "THU", label: "목요일", value: "THU" },
  { id: "FRI", label: "금요일", value: "FRI" },
  { id: "SAT", label: "토요일", value: "SAT" },
  { id: "SUN", label: "일요일", value: "SUN" },
];
