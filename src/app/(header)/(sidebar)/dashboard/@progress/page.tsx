"use client";

import Timer from "@/_components/timer";
import { useTodayScheduleStore } from "@/_store/todaySchedule";
import { Progress } from "@/_ui/progress";
import { TrophyIcon } from "@/_ui/svg/svg";

export default function ProgressPage() {
  const {
    doneTodoCount,
    totalTodoCount,

    notCompletedTodoCount,
  } = useTodayScheduleStore();
  return (
    <section className="flex flex-col gap-3 ">
      <div className="flex flex-col ">
        <div className="flex justify-between items-end">
          <div className="h-16 text-black text-sm font-normal">
            <Timer />
          </div>
          <div className="text-black font-semibold">
            {totalTodoCount
              ? ((doneTodoCount / totalTodoCount) * 100).toFixed()
              : 0}
            %
          </div>
        </div>
        <Progress
          value={(doneTodoCount / totalTodoCount) * 100}
          className="mt-3"
        />
      </div>
      <div className="flex items-center justify-between grow gap-2">
        <div className="flex flex-col items-center justify-center rounded-2xl  w-full  border-[#dcdfe5] border-2 py-2">
          <p className="text-[#3366cc] font-bold text-3xl">{doneTodoCount}</p>
          <p className="text-sm text-[#737b8c] font-medium">완료</p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl  w-full  border-[#dcdfe5] border-2 py-2">
          <p className="text-[#e74c3c] font-bold text-3xl">
            {notCompletedTodoCount}
          </p>
          <p className="text-sm text-[#737b8c] font-medium">미완료</p>
        </div>
      </div>
    </section>
  );
}
