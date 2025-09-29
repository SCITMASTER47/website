import { Schedule, ScheduleDetailResponse, TodoProps } from "@/_types/schedule";
import {
  getScheduleById,
  getTodosByScheduleId,
} from "@/_action-server/schedule";
import { getJwtFromCookie, getUserInfoFromJwt } from "@/_utils/cookie";

import { Suspense } from "react";
import TodoDetailView from "@/_components/schedule/TodoDetailView";
import ScheduleDetailView from "@/_ui/scheduleDetail";
import ScheduleAvgDashboard from "@/_ui/scheduleAvgDashboard";

interface ScheduleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScheduleDetailPage({
  params,
}: ScheduleDetailPageProps) {
  const scheduleId = (await params).id;
  const jwt = await getJwtFromCookie();
  const userInfo = await getUserInfoFromJwt(jwt);

  return (
    <section className="w-full h-full">
      {!scheduleId || !userInfo ? (
        error()
      ) : (
        <div className="flex h-full flex-row gap-2 overflow-hidden">
          <section className="flex-2 h-full  overflow-y-auto">
            <Suspense fallback={ScheduleLoading()}>
              <ScheduleInfo scheduleId={scheduleId} />
            </Suspense>
          </section>
          <section className="flex-5 h-full rounded-2xl border-2 border-gray-200 p-4 overflow-y-auto">
            <Suspense fallback={todosLoading()}>
              <TodosInfo scheduleId={scheduleId} userId={userInfo.id} />
            </Suspense>
          </section>
        </div>
      )}
    </section>
  );
}

function error() {
  return (
    <section className="flex flex-1 h-full items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          스케줄을 찾을 수 없습니다
        </h1>
        <p className="text-gray-600">
          요청하신 스케줄이 존재하지 않거나 접근 권한이 없습니다.
        </p>
      </div>
    </section>
  );
}
async function ScheduleInfo({ scheduleId }: { scheduleId: string }) {
  const schedule = await getScheduleById(scheduleId);

  if (!schedule) {
    return <ScheduleError />;
  }
  return (
    <div>
      <ScheduleDetailView schedule={schedule} />
    </div>
  );
}

async function TodosInfo({
  scheduleId,
  userId,
}: {
  scheduleId: string;
  userId: string;
}) {
  const todos = await getTodosByScheduleId(scheduleId, userId);

  if (!todos) {
    return <TodosError />;
  }
  return (
    <div className="flex flex-col gap-4">
      <ScheduleAvgDashboard todos={todos} />
      <TodoDetailView todos={todos} />
    </div>
  );
}

function ScheduleLoading() {
  return (
    <div className=" space-y-4 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className="space-y-3">
          <div className="h-8 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      {/* 진행률 카드 */}
      <div className="bg-white rounded-lg p-6 ">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center p-3 bg-gray-50 rounded">
              <div className="h-6 w-8 bg-gray-300 rounded mx-auto mb-1"></div>
              <div className="h-3 w-12 bg-gray-300 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 추가 카드들 */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 ">
          <div className="h-5 bg-gray-300 rounded w-32 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-gray-300 rounded-full w-3/5"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function todosLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {/* 헤더 */}
      <div className="bg-white rounded-lg p-4 ">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-300 rounded w-32"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 w-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Todo 아이템들 */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-white  rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 로딩 점들 */}
      <div className="text-center py-4">
        <div className="inline-flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
function ScheduleError() {
  return <div>ScheduleError</div>;
}
function TodosError() {
  return <div>TodosError</div>;
}
