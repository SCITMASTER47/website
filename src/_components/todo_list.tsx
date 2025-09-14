"use client";

import { useEffect, useRef, useState } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { TodoProps } from "@/_types/schedule";
import Todo from "./todo";
import { useTodayScheduleStore } from "@/_store/todaySchedule";

export interface TodoItem {
  data: TodoProps[];
}
export default function TodoList({ data: data }: TodoItem) {
  const { todos, isLoading, onClickComplete, setTodos } =
    useTodayScheduleStore();

  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);
  useEffect(() => {
    setTodos(data);
  }, [data, setTodos]);
  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollSectionRef.current;
      if (!el) return;
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
      setShowScrollIcon(!isBottom);
    };
    const el = scrollSectionRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [todos]);

  return (
    <div
      ref={scrollSectionRef}
      className="relative h-full flex w-full flex-col gap-4 p-1  overflow-y-scroll"
    >
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />
      {todos.map((task) => (
        <Todo key={task.id} {...task} onClickDone={onClickComplete} />
      ))}
      {!isLoading && showScrollIcon && (
        <button
          type="button"
          className="absolute bottom-4 right-4 bg-white border border-gray-300 rounded-full shadow p-2 flex items-center justify-center hover:bg-gray-100 transition"
          onClick={() => {
            if (scrollSectionRef.current) {
              scrollSectionRef.current.scrollTo({
                top: scrollSectionRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
        >
          <ArrowDownwardIcon />
        </button>
      )}
    </div>
  );
}
