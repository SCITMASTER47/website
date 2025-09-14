import { TodoListIcon, TrophyIcon } from "@/_ui/svg/svg";
import { Suspense } from "react";

export default function ScheduleLayout({
  calendar,
  todo,
  progress,
}: {
  calendar: React.ReactNode;
  todo: React.ReactNode;
  progress: React.ReactNode;
}) {
  return (
    <div className="h-full w-full ">
      <section
        id="main_section"
        className="flex flex-row overflow-hidden  h-full w-full"
      >
        <section className="w-72 h-full overflow-y-hidden border-r-2 border-r-border/50 ">
          <div className="relative w-full flex h-full grow">
            <div className="flex-1 overflow-y-hidden">
              <Suspense fallback={<TodosLoading />}>{todo}</Suspense>
            </div>
          </div>
        </section>

        {/* 오른쪽 절반 - 고정 영역 */}
        <section className="flex flex-col flex-5/7 h-full overflow-y-auto gap-4 pl-4">
          {progress}
          <section className="flex-1">{calendar}</section>
        </section>
      </section>
    </div>
  );
}

function TodosLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="flex items-center gap-2">
        <TrophyIcon />
        <span className="text-gray-600 text-xs font-semibold">
          할 일 목록 가져오는중...
        </span>
      </span>
    </div>
  );
}
