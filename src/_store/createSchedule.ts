import { create } from "zustand";
import {
  Book,
  Certification,
  ScheduleCreateRequest,
  WeekDay,
} from "@/_types/schedule";
import { createSchedule } from "@/_action/schedule";
import { weekdays } from "@/_constant/constants";

import { ProgressBarItem } from "@/_types/progress";

interface createScheduleStore {
  currentStepId: string;
  weekdays: WeekDay[];
  stepInfo: ProgressBarItem[];
  formData: ScheduleCreateRequest;
  loading: boolean;
  progressBarErrorMessage: string | null;
  isGenerating: boolean;
  isModalOpen: boolean;
  setCurrentStepId: (id: string) => void;
  setStepText: (id: string, label: string) => void;
  setFormData: (data: Partial<ScheduleCreateRequest>) => void;
  reset: () => void;
  setNextStep: (step: number) => Promise<void>;
  handleSelectCert: (certification: Certification) => string;
  handleExamDateChange: (date: Date | null) => string;
  handleBookSelect: (book: Book) => string;
  handleChangeStudyHour: (hour: number) => void;
  handleClickWeekDay: (
    day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
    checked: boolean
  ) => void;
  handleSubjectLevelChange: (
    subject: string,
    level: "고급" | "중급" | "초급"
  ) => void;
  setFocusNotes: (notes: string) => void;
  handleClickDateTimeNext: () => void;
  onSubmit: () => Promise<void>;
  handleClickModalSubmit: () => Promise<void>;
  handleClickModalCancel: () => void;
}

const initialFormData: ScheduleCreateRequest = {
  licenseId: "",
  examDate: "",
  bookId: "",
  availableDays: [],
  proficiency: {},
  userPrompt: "",
  targetHour: 1,
};
const defaultStepText: ProgressBarItem[] = [
  {
    id: "certification",
    label: "자격증 선택",
    url: "/create/certification",
    nextUrl: "/create/book",
    isDone: false,
  },
  {
    id: "book",
    label: "교재 선택",
    url: "/create/book",
    nextUrl: "/create/date",
    isDone: false,
  },
  {
    id: "date",
    label: "시험일 선택",
    url: "/create/date",
    nextUrl: "/create/time",
    isDone: false,
  },

  {
    id: "time",
    label: "학습 시간",
    url: "/create/time",
    nextUrl: "/create/confirm",
    isDone: false,
  },
  {
    id: "confirm",
    label: "이해도 평가",
    url: "/create/confirm",
    isDone: false,
  },
];
export const useCreateScheduleStore = create<createScheduleStore>(
  (set, get) => ({
    currentStepId: "certification",
    stepInfo: defaultStepText,
    weekdays: weekdays,
    loading: false,
    formData: initialFormData,
    progressBarErrorMessage: null,
    isGenerating: false,
    isModalOpen: false,

    setCurrentStepId: (id: string) => {
      set({ currentStepId: id });
    },
    setStepText: (id, label) => {
      set((state) => ({
        stepInfo: state.stepInfo.map((step) =>
          step.id === id ? { ...step, label } : step
        ),
      }));
    },
    setFormData: (data) =>
      set((state) => ({ formData: { ...state.formData, ...data } })),
    reset: () =>
      set({
        currentStepId: "certification",
        stepInfo: defaultStepText,
        formData: initialFormData,
      }),
    setNextStep: async (step) => {
      // 각 step별로 이전 정보들이 충분한지 확인한다.
      let undoIndex = step;
      //switch case 문으로 관리
      switch (step) {
        case 4:
          // 학습 시간이 완료되었는지 확인
          if (
            get().formData.availableDays.length <= 0 ||
            get().formData.targetHour <= 0
          ) {
            undoIndex = 3;
          }

        case 3:
          // 교재가 선택이 완료되었는지 확인
          if (get().formData.bookId === "") {
            undoIndex = 2;
          }
        case 2:
          // 날짜가 선택 되었는지 확인
          if (get().formData.examDate === "") {
            undoIndex = 1;
          }
        case 1:
          // 자격증 선택이 완료되었는지 확인

          if (get().formData.licenseId === "") {
            undoIndex = 0;
          }
      }
      set({
        currentStepId: get().stepInfo[undoIndex].id,
        progressBarErrorMessage:
          undoIndex < step
            ? `${get().stepInfo[undoIndex]}를 완료해주세요.`
            : null,
      });
      // 1초 두고 에러메시지 제거
      await new Promise((resolve) => setTimeout(resolve, 1000));
      set({ progressBarErrorMessage: null });
    },
    handleSelectCert: (certification: Certification) => {
      //1. formData 업데이트
      get().setFormData({ licenseId: certification.id });
      //2. stepText 업데이트

      if (certification) {
        get().setStepText("certification", certification.title);
        //3.isDone 업데이트
        set((state) => ({
          stepInfo: state.stepInfo.map((step) =>
            step.id === "certification" ? { ...step, isDone: true } : step
          ),
        }));
        return (
          `${get().stepInfo[0].nextUrl}?cid=${certification.id}` ||
          "/create/book"
        );
      }
      // fail case
      set((state) => ({
        stepInfo: state.stepInfo.map((step) =>
          step.id === "certification" ? { ...step, isDone: false } : step
        ),
      }));
      return "#";
    },
    handleExamDateChange: (date: Date | null) => {
      //1. formData 업데이트
      // 타임존 보정해서 YYYY-MM-DD 형식으로 저장
      const exam_date = date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
        : "";
      if (exam_date === "") {
        // isDone false 처리
        set((state) => ({
          stepInfo: state.stepInfo.map((step) =>
            step.id === "date" ? { ...step, isDone: false } : step
          ),
        }));
        return "#";
      }
      get().setFormData({ examDate: exam_date });
      //2. stepText 업데이트
      get().setStepText("date", exam_date || "시험일 선택");
      //3.isDone 업데이트
      set((state) => ({
        stepInfo: state.stepInfo.map((step) =>
          step.id === "date" ? { ...step, isDone: true } : step
        ),
      }));
      return get().stepInfo[2].nextUrl || "/create/time";
    },
    handleBookSelect: (book: Book) => {
      //1. formData 업데이트
      get().setFormData({ bookId: book.id });
      //2. stepText 업데이트
      if (book) {
        get().setStepText("book", book.title);
      }
      //3.isDone 업데이트
      set((state) => ({
        stepInfo: state.stepInfo.map((step) =>
          step.id === "book" ? { ...step, isDone: true } : step
        ),
      }));
      return get().stepInfo[1].nextUrl || "/create/date";
    },
    handleChangeStudyHour: (hour: number) => {
      //1. formData 업데이트
      get().setFormData({ targetHour: hour });
    },
    handleClickWeekDay: (
      day: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
      checked: boolean
    ) => {
      // formData.availableDays 업데이트
      const available_days = get().formData.availableDays;
      if (checked) {
        if (!available_days.includes(day)) {
          get().setFormData({ availableDays: [...available_days, day] });
        }
      } else {
        get().setFormData({
          availableDays: available_days.filter((d) => d !== day),
        });
      }
    },
    handleSubjectLevelChange: (
      subject: string,
      level: "초급" | "중급" | "고급"
    ) => {
      // formData.proficiency 업데이트
      get().setFormData({
        proficiency: {
          ...get().formData.proficiency,
          [subject]: level,
        },
      });
    },
    setFocusNotes: (notes: string) => {
      get().setFormData({ userPrompt: notes });
    },
    onSubmit: async () => {
      try {
        // formData 모든 입력이 완료되었는지 확인.
        if (get().formData.licenseId === "") {
          throw new Error("자격증을 선택해주세요.");
        }
        if (get().formData.examDate === "") {
          throw new Error("시험일을 선택해주세요.");
        }
        if (get().formData.bookId === "") {
          throw new Error("교재를 선택해주세요.");
        }
        if (get().formData.targetHour <= 0) {
          throw new Error("학습 시간을 설정해주세요.");
        }
        if (Object.keys(get().formData.proficiency).length === 0) {
          throw new Error("이해도 평가를 선택해주세요.");
        }
        // 모두 입력되어있다면   set({ loading: true, isGenerating: true }); 아니면 error Throw
        set({ loading: true, isGenerating: true, isModalOpen: true });
      } catch {
        throw new Error("모든 정보를 입력해주세요.");
      }
    },
    handleClickDateTimeNext: () => {
      get().setNextStep(4);
    },
    handleClickModalCancel: () => {
      set({ isModalOpen: false, isGenerating: false, loading: false });
    },
    handleClickModalSubmit: async () => {
      try {
        const res = await createSchedule(get().formData);
        window.location.href = `/dashboard/AI/${res.chatSessionId}`;
      } catch {
        // 에러 처리
        throw new Error("일정 생성에 실패했습니다. 다시 시도해주세요.");
      } finally {
        set({ isModalOpen: false });
      }
    },
  })
);
