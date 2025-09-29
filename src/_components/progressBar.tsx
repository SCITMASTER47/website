"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import { ProgressBarItem } from "@/_types/progress";
import { Certification } from "@/_types/schedule";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProgressBar() {
  const { stepInfo: defaultStepInfo, progressBarErrorMessage } =
    useCreateScheduleStore();
  const pathname = usePathname();
  const [stepInfo, setStepInfo] = useState(defaultStepInfo);

  // 현재 단계 추출
  const currentStep = pathname.split("/").pop() || "certification";

  // Cookie에서 선택된 정보를 읽어와서 stepInfo 업데이트
  useEffect(() => {
    if (typeof window !== "undefined") {
      const updatedStepInfo = [...defaultStepInfo];

      // 자격증 정보
      const licenseTitle = document.cookie
        .split("; ")
        .find((row) => row.startsWith("create_schedule_license_title="))
        ?.split("=")[1];

      if (licenseTitle) {
        updatedStepInfo[0] = {
          ...updatedStepInfo[0],
          label: decodeURIComponent(licenseTitle),
          isDone: true,
        };
      }

      // 시험일 정보
      const examDate = document.cookie
        .split("; ")
        .find((row) => row.startsWith("create_schedule_exam_date="))
        ?.split("=")[1];

      if (examDate) {
        updatedStepInfo[2] = {
          ...updatedStepInfo[2],
          label: examDate,
          isDone: true,
        };
      }

      // 교재 정보
      const bookTitle = document.cookie
        .split("; ")
        .find((row) => row.startsWith("create_schedule_book_title="))
        ?.split("=")[1];

      if (bookTitle) {
        const certification: Certification = JSON.parse(
          decodeURIComponent(
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("create_schedule_license_id="))
              ?.split("=")[1] || "{}"
          )
        );
        updatedStepInfo[1] = {
          ...updatedStepInfo[1],
          label: decodeURIComponent(bookTitle),
          url: `/create/book?cid=${certification.id}`,
          isDone: true,
        };
      }

      // 시간 정보 (요일별 시간이 하나라도 설정되어 있으면 완료로 표시)
      const hasTimeData = document.cookie
        .split("; ")
        .some(
          (row) =>
            row.startsWith("create_schedule_available_days") &&
            row.includes("=")
        );

      if (hasTimeData) {
        const dateJson = JSON.parse(
          decodeURIComponent(
            document.cookie
              .split("; ")
              .find((row) => row.startsWith("create_schedule_available_days"))
              ?.split("=")[1] || "{}"
          )
        );

        updatedStepInfo[3] = {
          ...updatedStepInfo[3],
          label: dateJson.total
            ? dateJson.total + "시간"
            : updatedStepInfo[3].label,
          isDone: true,
        };
      }

      setStepInfo(updatedStepInfo);
    }
  }, [defaultStepInfo, pathname]); // pathname이 바뀔 때마다 재실행

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
  return (
    <div className="flex flex-col h-full w-full gap-8 justify-start items-start  ">
      {steps.map((step, idx) => (
        <Link
          href={step.url ? step.url : "#"}
          key={idx}
          className="flex items-center  gap-4 "
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
