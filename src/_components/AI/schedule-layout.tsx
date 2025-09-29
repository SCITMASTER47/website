"use client";

import { useAIChatStore } from "@/_store/aiChat";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimelineIcon from "@mui/icons-material/Timeline";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useState } from "react";
import Todo, { TodoSkeleton } from "../todo";
import { useRouter } from "next/navigation";

export default function ScheduleLayout() {
  const {
    todos,
    isGenerating,
    versions,
    currentVersionId: currentVersion,
    handleVersionChange,
    onSaveSchedule,
  } = useAIChatStore();
  const [hoveredVersion, setHoveredVersion] = useState<number | null>(null);
  const router = useRouter();
  const currentStudyPlan =
    versions.find((version) => version.versionId === currentVersion)
      ?.studyPlan || [];
  const handleClickSave = async () => {
    if (!currentVersion) return;
    const result = await onSaveSchedule();
    router.replace(result);
  };
  return (
    <section id="scheduleSection" className="flex w-full flex-col h-full ">
      {/* 버전 탭 */}
      {versions.length > 0 && (
        <section className="w-full relative mb-2 ">
          <div className="flex items-center justify-between mb-3 px-2">
            <div className="flex items-center gap-2">
              <TimelineIcon className="text-primary text-lg" />
              <span className="text-sm font-semibold text-gray-700">
                학습 계획 버전
              </span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {versions.length}개의 버전
            </span>
          </div>
          <div className="flex items-center justify-between w-full gap-10 ">
            <div className="flex grow justify-start items-end overflow-x-auto gap-1 px-2">
              {versions.map((version, index) => (
                <button
                  key={index}
                  onClick={() => handleVersionChange(version.versionId)}
                  onMouseEnter={() => setHoveredVersion(index)}
                  onMouseLeave={() => setHoveredVersion(null)}
                  className={`
                  flex items-center gap-2 px-4 py-2 rounded-t-xl text-sm font-medium transition-all duration-200 min-w-fit whitespace-nowrap
                  ${
                    version.versionId === currentVersion
                      ? "bg-primary text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-102"
                  }
                `}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      version.versionId === currentVersion
                        ? "bg-white"
                        : "bg-primary"
                    }`}
                  ></div>
                  버전 {index + 1}
                </button>
              ))}
            </div>
            <button
              key={"create"}
              onClick={handleClickSave}
              disabled={isGenerating || versions.length === 0}
              className="
                  flex items-center border-2 border-gray-100 gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 min-w-fit whitespace-nowrap hover:scale-95 active:scale-90
                "
            >
              <div className={`w-2 h-2 rounded-full bg-green-500`}></div>
              생성
            </button>
          </div>

          {/* 툴팁 */}
          {hoveredVersion !== null && versions[hoveredVersion]?.summary && (
            <div className="absolute top-full left-2 z-50 mt-2 max-w-md">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AutoAwesomeIcon className="text-primary text-sm" />
                  <span className="text-xs font-semibold text-primary">
                    버전 {hoveredVersion + 1} 요약
                  </span>
                </div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {versions[hoveredVersion].summary}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 메인 콘텐츠 */}
      <section className="flex flex-col flex-1 min-h-0 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* 헤더 */}

        {/* TODO 리스트 */}
        {todos.length < 1 && !isGenerating ? (
          <div className="flex flex-1 w-full items-center justify-center p-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-6">
                <CalendarTodayIcon className="text-primary text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                학습 계획을 시작해보세요
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
                AI 플래너에게 원하는 학습 주제나 목표를 말씀해주시면
                <br />
                맞춤형 학습 계획을 생성해드립니다
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  예: &ldquo;자바스크립트 기초 학습&rdquo;
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                  예: &ldquo;토익 800점 달성&rdquo;
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-y-auto p-4">
            {/* 생성 중 표시 */}
            {isGenerating && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-primary font-medium">
                  AI가 학습 계획을 생성하고 있습니다...
                </span>
              </div>
            )}

            <div className="space-y-3">
              {/* 완료된 TODO들 먼저 표시 */}
              {isGenerating
                ? todos.map((todo, idx) => (
                    <div
                      key={todo.id}
                      className="animate-fade-in transform hover:scale-[1.02] transition-all duration-200"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <Todo {...todo} readOnly />
                    </div>
                  ))
                : currentStudyPlan.map((todo, idx) => (
                    <div
                      key={todo.id}
                      className="animate-fade-in transform hover:scale-[1.02] transition-all duration-200"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        animationFillMode: "backwards",
                      }}
                    >
                      <Todo {...todo} readOnly />
                    </div>
                  ))}
            </div>
          </div>
        )}
      </section>
    </section>
  );
}
