"use client";

import { useCreateScheduleStore } from "@/_store/createSchedule";
import CertificationStep from "@/_components/create/certification_step";
import ExamDateStep from "@/_components/create/ExamDateStep";
import BookSelectStep from "@/_ui/BookSelectStep";
import SelectDataAndTime from "@/_ui/SelectDataAndTime";
import SubjectLevelStep from "@/_ui/SubjectLevelStep";

function Modal({
  onClose,
  onCancel,
  visible,
}: {
  onClose: () => void;
  onCancel: () => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경: 반투명 + blur */}
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg p-8 z-10 min-w-[300px]">
        <h2 className="text-xl font-bold mb-4">AI 플래너 생성하기</h2>
        <p className="mb-6">
          제출을 누르면 새로운 AI 플래너 생성 페이지로 이동합니다. <br />
          제출 버튼을 누르고 입력 정보를 바탕으로 플래너를 생성해보세요.
        </p>
        <div className="flex justify-between gap-4">
          <button
            className="flex grow items-center justify-center px-4 py-2 bg-white border-2 border-gray-100  rounded-lg  transition-all hover:scale-95 active:scale-90"
            onClick={onCancel}
          >
            취소
          </button>
          <button
            className=" flex flex-grow-3 items-center justify-center px-4 py-2 bg-primary text-white rounded-lg transition-all hover:scale-95 active:scale-90 "
            onClick={onClose}
          >
            제출
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateScheduleBody() {
  const {
    currentStepId: step,
    isModalOpen,
    handleClickModalCancel,
    handleClickModalSubmit,
  } = useCreateScheduleStore();

  return (
    <div className="flex grow p-4">
      <Modal
        onClose={handleClickModalSubmit}
        visible={isModalOpen}
        onCancel={handleClickModalCancel}
      />

      {/* {step === 0 && <CertificationStep />} */}
      {step == 1 && <ExamDateStep />}
      {step == 2 && <BookSelectStep />}
      {step == 3 && <SelectDataAndTime />}
      {step == 4 && <SubjectLevelStep />}
    </div>
  );
}
