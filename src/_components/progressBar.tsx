"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import { ProgressBarItem } from "@/_types/progress";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/_ui/button";

export default function ProgressBar() {
  const {
    stepInfo: defaultStepInfo,
    progressBarErrorMessage,
    selectedCertification,
    selectedBook,
    examDate,
    availableDays,
    subjectLevel,
    canGoToNextStep,
  } = useCreateScheduleStore();
  const pathname = usePathname();
  const router = useRouter();
  const [stepInfo, setStepInfo] = useState(defaultStepInfo);

  // 현재 단계 추출
  const currentStep = pathname.split("/").pop() || "certification";

  // Store에서 선택된 정보를 읽어와서 stepInfo 업데이트
  useEffect(() => {
    const updatedStepInfo = [...defaultStepInfo];

    // 자격증 정보
    if (selectedCertification) {
      updatedStepInfo[0] = {
        ...updatedStepInfo[0],
        label: selectedCertification.title,
        isDone: true,
      };
    }

    // 교재 정보
    if (selectedBook) {
      updatedStepInfo[1] = {
        ...updatedStepInfo[1],
        label: selectedBook.title,
        url: selectedCertification
          ? `/create/book?cid=${selectedCertification.id}`
          : "/create/book",
        isDone: true,
      };
    }

    // 시험일 정보
    if (examDate) {
      updatedStepInfo[2] = {
        ...updatedStepInfo[2],
        label: examDate.toLocaleDateString(),
        isDone: true,
      };
    }

    // 시간 정보
    if (availableDays && availableDays.length > 0) {
      updatedStepInfo[3] = {
        ...updatedStepInfo[3],
        label: `${availableDays.reduce((sum, day) => sum + day.hour, 0)}시간`,
        isDone: true,
      };
    }

    // 이해도 평가 정보
    if (Object.keys(subjectLevel).length > 0) {
      const completedSubjects = Object.values(subjectLevel).filter(
        (level) => level !== null
      ).length;
      updatedStepInfo[4] = {
        ...updatedStepInfo[4],
        label: `${completedSubjects}개 과목 완료`,
        isDone: true,
      };
    }

    setStepInfo(updatedStepInfo);
  }, [
    defaultStepInfo,
    selectedCertification,
    selectedBook,
    examDate,
    availableDays,
    subjectLevel,
    pathname,
  ]);

  // 다음 단계로 이동하는 함수
  const handleNextStep = () => {
    const currentStepIndex = stepInfo.findIndex(
      (step) => step.id === currentStep
    );
    if (currentStepIndex < stepInfo.length - 1) {
      const nextStep = stepInfo[currentStepIndex + 1];
      router.push(nextStep.url || "#");
    }
  };

  // 현재 단계에서 다음으로 갈 수 있는지 확인
  const canGoNext = canGoToNextStep(currentStep);
  const isLastStep = currentStep === "confirm";

  return (
    <div className="flex-1 gap-2 w-full items-center pl-2 ">
      <div className="h-4 ">
        {progressBarErrorMessage && (
          <div className=" text-xs text-red-500 font-bold text-center">
            {progressBarErrorMessage}
          </div>
        )}
      </div>
      <StepProgressBar steps={stepInfo} currentId={currentStep} />

      {/* 다음 단계 버튼 */}
      <div className="mt-6 px-2">
        {!isLastStep && (
          <Button
            onClick={handleNextStep}
            disabled={!canGoNext}
            className="w-full"
            size="sm"
          >
            {canGoNext ? "다음 단계" : "정보를 입력해주세요"}
          </Button>
        )}
      </div>
    </div>
  );
}

function StepProgressBar({
  steps,
  currentId,
}: {
  steps: ProgressBarItem[];
  currentId: string;
}) {
  const { canGoToNextStep } = useCreateScheduleStore();

  // 해당 단계로 갈 수 있는지 확인하는 함수
  const canAccessStep = (stepId: string, stepIndex: number) => {
    if (stepIndex === 0) return true; // 첫 번째 단계는 항상 접근 가능

    // 이전 단계들이 모두 완료되었는지 확인
    const previousStepId = steps[stepIndex - 1]?.id;
    return previousStepId ? canGoToNextStep(previousStepId) : false;
  };

  return (
    <div className="flex flex-col h-full w-full gap-8 justify-start items-start">
      {steps.map((step, idx) => {
        const isAccessible = canAccessStep(step.id, idx);

        const stepContent = (
          <>
            <div className="relative flex items-center justify-center">
              {/* 현재 진행중인 원 뒤에 애니메이션 회색 원 */}
              {step.id === currentId && (
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: 0 }}
                >
                  <span className="block w-9 h-9 rounded-full bg-primary/50 opacity-60 animate-grow-shrink-tw" />
                </span>
              )}
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all focus:outline-none
                      ${
                        step.isDone
                          ? "bg-primary border-primary "
                          : "bg-white border-primary/40"
                      }
                      ${
                        step.id === currentId
                          ? "border-primary animate-pulse  shadow-lg"
                          : ""
                      }
                    `}
                aria-label={`단계 ${idx + 1}`}
                style={{ position: "relative", zIndex: 1 }}
              >
                <span
                  className={`text-sm font-bold ${
                    step.isDone
                      ? "text-white"
                      : step.id === currentId
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                >
                  {idx + 1}
                </span>
              </div>
            </div>
            <span
              className={`mt-2 text-xs ${
                step.id === currentId
                  ? "text-primary font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </>
        );

        return (
          <div key={idx}>
            {isAccessible ? (
              <Link
                href={step.url || "#"}
                className="flex items-center gap-4 cursor-pointer hover:opacity-80"
              >
                {stepContent}
              </Link>
            ) : (
              <div className="flex items-center gap-4 cursor-not-allowed opacity-60">
                {stepContent}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
