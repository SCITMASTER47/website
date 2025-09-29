"use client";

import useSidebarStore from "@/_store/sidebar";
import React, { useEffect } from "react";
import { SidebarItem } from "@/_types/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Schedule, ScheduleDetailResponse } from "@/_types/schedule";
import { PlusIcon, CalendarIcon, UsersIcon, BookOpenIcon } from "lucide-react";
export interface SideBarProps {
  schedules: ScheduleDetailResponse[];
}
export default function SideBarComponent({ schedules }: SideBarProps) {
  const { items, addSchedules } = useSidebarStore();
  const currentPath = usePathname();
  console.log("Current Path:", currentPath);

  // 스케줄 이름을 줄임말로 변환하는 함수
  const getShortName = (name: string): string => {
    if (!name) return "";

    // 특정 패턴들에 대한 줄임말 매핑
    const shortNameMap: { [key: string]: string } = {
      "JLPT N1": "N1",
      "JLPT N2": "N2",
      "JLPT N3": "N3",
      "JLPT N4": "N4",
      "JLPT N5": "N5",
      정보처리기사: "정처기",
      컴활1급: "컴활1",
      컴활2급: "컴활2",
      토익: "TOEIC",
      토플: "TOEFL",
      오픽: "OPIC",
    };

    // 정확히 일치하는 경우
    if (shortNameMap[name]) {
      return shortNameMap[name];
    }

    // JLPT 패턴 찾기
    const jlptMatch = name.match(/JLPT.*?N(\d)/i);
    if (jlptMatch) {
      return `N${jlptMatch[1]}`;
    }

    // 한글에서 줄임말 만들기 (예: 정보처리기사 -> 정처기)
    if (/[가-힣]/.test(name)) {
      const words = name.split(/\s+/);
      if (words.length === 1 && words[0].length > 3) {
        // 단일 단어가 3글자 이상이면 앞 2글자 + 마지막 글자
        const word = words[0];
        return word.slice(0, 2) + word.slice(-1);
      }
    }

    // 영어는 첫 글자들만
    if (/^[a-zA-Z\s]+$/.test(name)) {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
    }

    // 기본적으로 첫 3글자
    return name.slice(0, 3);
  };

  const iconMap = React.useMemo(
    () => ({
      add: <PlusIcon className="text-primary w-5 h-5" />,
      dashboard: <CalendarIcon className="text-primary w-5 h-5" />,
      users: <UsersIcon className="text-primary w-5 h-5" />,
      schedule: <BookOpenIcon className="text-primary w-5 h-5" />,
    }),
    []
  );
  useEffect(() => {
    if (schedules && schedules.length > 0) {
      addSchedules(schedules);
    }
  }, [schedules, addSchedules]);
  return (
    <div className="flex flex-col py-4 gap-4 items-start justify-start  w-18 h-full border-r border-r-border/50 ">
      {items.map((item) => (
        <div
          className={` px-4 ${
            currentPath === item.link ? " border-primary" : "border-transparent"
          } border-l-4`}
          key={item.id}
        >
          <div className="relative">
            <IconButton
              key={item.id}
              item={item}
              icon={iconMap[item.iconId as keyof typeof iconMap]}
            />
            {item.iconId === "schedule" && item.displayName && (
              <div className="absolute -top-2 left-0 transform -translate-x-1/2 bg-primary text-white text-[10px] px-1 py-0.5 rounded-full font-medium min-w-[20px] text-center">
                {getShortName(item.displayName)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function IconButton({
  item,
  icon,
}: {
  item: SidebarItem;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={item.link}
      className={`p-2 w-10 h-10 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:rotate-360 active:scale-90 transition-all duration-500 border-primary`}
    >
      {icon}
    </Link>
  );
}
