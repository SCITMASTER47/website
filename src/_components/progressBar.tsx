"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import { ProgressBarItem } from "@/_types/progress";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProgressBar() {
  const {
    currentStepId,
    stepInfo,
    loading,
    progressBarErrorMessage,
    setCurrentStepId,
  } = useCreateScheduleStore();

  const currentPath = usePathname();
  const currentStep = currentPath.split("/").pop();
  useEffect(() => {
    if (currentStepId !== currentStep) {
      setCurrentStepId(currentStep || "certification");
    }
  }, [currentStepId, currentStep, setCurrentStepId]);

  return (
    <div className="flex-1 gap-2 w-full items-center pl-2 ">
      <div className="h-4 ">
        {progressBarErrorMessage && (
          <div className=" text-xs text-red-500 font-bold text-center">
            {progressBarErrorMessage}
          </div>
        )}
      </div>
      <StepProgressBar
        steps={stepInfo}
        currentId={currentStepId}
        disabled={loading}
      />
    </div>
  );
}

function StepProgressBar({
  steps,
  currentId,
  disabled,
}: {
  steps: ProgressBarItem[];
  currentId: string;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col h-full w-full gap-8 justify-start items-start  ">
      {steps.map((step, idx) => (
        <Link
          href={step.url ? step.url : "#"}
          key={idx}
          className="flex items-center  gap-4 "
          // disabled={disabled}
        >
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
        </Link>
      ))}
    </div>
  );
}
