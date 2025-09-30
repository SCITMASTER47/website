"use client";
import { useCreateScheduleStore } from "@/_store/createSchedule";
import { Subject } from "@/_types/schedule";
import { CardContent } from "@/_ui/card";
import { Label } from "@/_ui/label";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";

export default function SubjectLevelStep() {
  const [subjectState, setSubjectState] = useState<{
    [key: string]: "초급" | "중급" | "고급" | null;
  }>({});
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    selectedCertification,
    subjectLevel,
    focusNotes,
    handleSubjectLevelChange,
    setFocusNotes,
    onSubmit,
    loading,
  } = useCreateScheduleStore();

  // store에서 자격증 정보 가져오기 및 유효성 검사
  useEffect(() => {
    if (selectedCertification && selectedCertification.subjects) {
      setSubjects(selectedCertification.subjects);

      // 기존에 선택된 과목 레벨이 있으면 상태에 반영
      if (Object.keys(subjectLevel).length > 0) {
        setSubjectState(subjectLevel);
      }
    } else {
      // 자격증 정보가 없으면 첫 번째 단계로 리다이렉트
      setSubjects([]);
      if (!selectedCertification) {
        router.push("/create/certification");
      }
    }
  }, [selectedCertification, subjectLevel, router]);

  // 모든 과목에 대한 레벨이 선택되었는지 확인
  const isNextStepAvailable = useMemo(() => {
    return (
      subjects.length > 0 &&
      subjects.every(
        (subject) => subjectState[subject.name] && subjectState[subject.name]
      )
    );
  }, [subjects, subjectState]);

  const handleLevelChange = (
    subjectName: string,
    level: "초급" | "중급" | "고급"
  ) => {
    const newState = {
      ...subjectState,
      [subjectName]: level,
    };
    setSubjectState(newState);

    handleSubjectLevelChange(newState);
  };
  const handleSubmit = async () => {
    setError(null);
    try {
      const chatSessionId = await onSubmit(focusNotes);
      router.replace(`/ai/${chatSessionId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(
          error.message || "AI 스케쥴 생성에 실패했습니다. 다시 시도해주세요."
        );
      }

      console.error("Failed to submit schedule:", error);
    }
  };
  return (
    <section className="flex flex-col h-full justify-between">
      <CardContent className="flex  overflow-y-auto flex-col gap-4  justify-between">
        <div className="space-y-2">
          {!selectedCertification ? (
            <div className="text-center py-8 text-gray-500">
              자격증을 먼저 선택해주세요.
            </div>
          ) : subjects.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              자격증 정보를 불러오는 중...
            </div>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="space-y-4 border-b-2 border-gray-50 pb-2"
              >
                <Label className="text-md font-bold block">
                  {subject.name}
                </Label>
                <div className="flex flex-row justify-around gap-8">
                  <LevelBar
                    subjectName={subject.name}
                    selectedLevel={subjectState[subject.name] || null}
                    onLevelSelect={handleLevelChange}
                  />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-8 space-y-2">
          <Label htmlFor="notes" className="font-semibold text-gray-700">
            추가 요청사항 (선택사항)
          </Label>
          <textarea
            id="notes"
            className="w-full min-h-[80px] rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
            placeholder="특별히 집중하고 싶은 부분이나 요청사항이 있다면 적어주세요"
            value={focusNotes}
            onChange={(e) => setFocusNotes(e.target.value)}
            disabled={loading}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </CardContent>
      <button
        type="button"
        className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-bold text-base transition flex items-center justify-center ${
          isNextStepAvailable && !loading
            ? "bg-purple-600 hover:bg-purple-700 shadow-md"
            : "bg-gray-300 cursor-not-allowed"
        }`}
        onClick={handleSubmit}
        disabled={!isNextStepAvailable || loading}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            생성 중...
          </span>
        ) : (
          "AI로 스케쥴 생성하기"
        )}
      </button>
    </section>
  );
}

interface LevelBarProps {
  subjectName: string;
  selectedLevel: string | null;
  onLevelSelect: (subjectName: string, level: "초급" | "중급" | "고급") => void;
}

function LevelBar({
  subjectName,
  selectedLevel,
  onLevelSelect,
}: LevelBarProps) {
  const levels = [
    { value: "초급", label: "하", color: "bg-purple-300 hover:bg-purple-400" },
    { value: "중급", label: "중", color: "bg-purple-400 hover:bg-purple-500" },
    { value: "고급", label: "상", color: "bg-purple-500 hover:bg-purple-600" },
  ];

  return (
    <div className="w-fit flex flex-col">
      <div className="flex gap-2">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() =>
              onLevelSelect(
                subjectName,
                level.value as "초급" | "중급" | "고급"
              )
            }
            className={`
              group w-12 h-12 rounded-lg transition-all duration-200 hover:scale-110 flex items-center justify-center font-medium
              ${
                selectedLevel === level.value
                  ? level.color
                  : "bg-gray-200 hover:bg-gray-300"
              }
            `}
            title={`${level.label} (${level.value})`}
          >
            <span
              className={`${
                selectedLevel === level.value
                  ? "text-white"
                  : "text-gray-600 group-hover:text-gray-800"
              } text-sm font-bold`}
            >
              {level.label}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
        <span>초급</span>
        <span>중급</span>
        <span>고급</span>
      </div>
    </div>
  );
}
