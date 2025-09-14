import { TodoProps } from "@/_types/schedule";
import { BookIcon, CalendarIcon, TimerIcon } from "@/_ui/svg/svg";
import React from "react";

export default function Todo({
  id,
  date,
  startPage,
  endPage,
  keyword: keyword,
  chapter,
  minute: estimatedTime,
  isDone: completed,
  readOnly = false,
  onClickDone,
  onClickInProgress,
}: TodoProps & {
  readOnly?: boolean;
  onClickDone?: (id: number, status: boolean) => void;
  onClickInProgress?: (id: number) => void;
}) {
  return (
    <div
      className={`w-full rounded-2xl bg-white  shadow-sm px-4 py-2 flex flex-col   transition-all duration-200 border border-l-4 border-l-primary/30 ${
        completed ? "opacity-50" : ""
      }`}
    >
      <div className="flex flex-col gap-1 ">
        <div className="flex items-start justify-between">
          <div
            className={`font-semibold  text-black  ${
              completed ? "line-through" : ""
            }`}
          >
            {chapter}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-1">
          {keyword.map((item, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full bg-[#f2f1ef] text-primary/80 text-xs font-bold border border-[#e8e7e4]"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <CalendarIcon />
            <span className="text-xs text-[#a8a39a] font-medium">{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookIcon />

            <span className="text-xs text-[#a8a39a] font-medium">
              {startPage}-{endPage}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TimerIcon />
            <span className="text-xs text-[#a8a39a] font-medium">
              {estimatedTime}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-2 mt-2">
        {/* {notes && (
          <div className="text-xs text-gray-600 italic whitespace-pre-wrap break-words">
            {notes}
          </div>
        )} */}
        {readOnly ? null : (
          <div className="flex items-center justify-start grow gap-1">
            <button
              onClick={() => {
                if (onClickDone) {
                  onClickDone(id, !completed);
                }
              }}
              className={`bg-[#f8f9fb] flex flex-col items-center justify-center rounded-md  w-fit  border-[#dcdfe5] border py-1 px-2 hover:scale-95 active:scale-90 transition-all `}
            >
              <div className="text-[#3366cc] text-black font-medium text-xs text-nowrap">
                완료
              </div>
            </button>
            <button
              className={`bg-[#f8f9fb] flex flex-col items-center justify-center rounded-md  w-fit  border-[#dcdfe5] border py-1 px-2 hover:scale-95 active:scale-90 transition-all `}
            >
              <div className="text-[#f5a83d] text-black font-medium text-xs text-nowrap">
                진행중
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
