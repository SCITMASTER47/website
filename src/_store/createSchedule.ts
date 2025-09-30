import { create } from "zustand";
import {
  AvailableDayInfo,
  Book,
  Certification,
  ScheduleCreateRequest,
  WeekDay,
} from "@/_types/schedule";
import { weekdays } from "@/_constant/constants";

import { ProgressBarItem } from "@/_types/progress";
import { createSchedule } from "@/_action/schedule";
import { createAISessionResponse } from "@/_types/chat";

interface createScheduleStore {
  // 스텝 정보
  weekdays: WeekDay[];
  stepInfo: ProgressBarItem[];
  loading: boolean;
  progressBarErrorMessage: string | null;

  // 스케줄 생성 데이터
  selectedCertification: Certification | null;
  selectedBook: Book | null;
  examDate: Date | null;
  subjectLevel: { [key: string]: "초급" | "중급" | "고급" | null };
  availableDays: AvailableDayInfo[];
  focusNotes: string;

  // 액션들
  reset: () => void;
  handleSelectCert: (certification: Certification) => string;
  handleExamDateChange: (date: Date | null) => string;
  handleBookSelect: (book: Book) => string;
  handleSubjectLevelChange: (subjectLevel: {
    [key: string]: "초급" | "중급" | "고급" | null;
  }) => void;
  setFocusNotes: (notes: string) => void;
  handleClickDateTimeNext: (availableDays: AvailableDayInfo) => void;
  onSubmit: (prompt: string | undefined) => Promise<string>;

  // 유효성 검사
  canGoToNextStep: (currentStep: string) => boolean;
}

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
    // 스텝 정보
    stepInfo: defaultStepText,
    weekdays: weekdays,
    loading: false,
    progressBarErrorMessage: null,

    // 스케줄 생성 데이터
    selectedCertification: null,
    selectedBook: null,
    examDate: null,
    subjectLevel: {},
    availableDays: [],
    focusNotes: "",

    reset: () => {
      set({
        selectedCertification: null,
        selectedBook: null,
        examDate: null,
        subjectLevel: {},
        availableDays: [],
        focusNotes: "",
        loading: false,
        progressBarErrorMessage: null,
      });
    },
    handleSelectCert: (certification: Certification) => {
      set({ selectedCertification: certification });
      return (
        `${get().stepInfo[0].nextUrl}?cid=${certification.id}` || "/create/book"
      );
    },
    handleExamDateChange: (date: Date | null) => {
      if (!date) return "#";

      set({ examDate: date });
      return get().stepInfo[2].nextUrl || "/create/time";
    },
    handleBookSelect: (book: Book) => {
      set({ selectedBook: book });
      return get().stepInfo[1].nextUrl || "/create/date";
    },

    handleSubjectLevelChange: (subjectLevel: {
      [key: string]: "초급" | "중급" | "고급" | null;
    }) => {
      set({ subjectLevel });
    },

    setFocusNotes: (notes: string) => {
      set({ focusNotes: notes });
    },
    onSubmit: async (prompt: string | undefined) => {
      try {
        set({ loading: true });
        const state = get();

        if (
          state.selectedCertification &&
          state.examDate &&
          state.selectedBook &&
          state.availableDays.length > 0 &&
          Object.keys(state.subjectLevel).length > 0
        ) {
          const formData: ScheduleCreateRequest = {
            licenseId: state.selectedCertification.id,
            examDate: state.examDate.toISOString().split("T")[0],
            bookId: state.selectedBook.id,
            weeklySchedule: state.availableDays,
            proficiency: Object.fromEntries(
              Object.entries(state.subjectLevel).filter(
                ([_, value]) => value !== null
              )
            ) as { [key: string]: "초급" | "중급" | "고급" },
            userPrompt: prompt ?? state.focusNotes,
            targetHour: state.availableDays.reduce(
              (sum, day) => sum + day.hour,
              0
            ),
          };

          const createResponse: createAISessionResponse = await createSchedule(
            formData
          );

          get().reset();
          return createResponse.chatSessionId;
        } else {
          throw new Error("모든 정보를 입력해주세요.");
        }
      } catch {
        throw new Error("모든 정보를 입력해주세요.");
      } finally {
        set({ loading: false });
      }
    },

    handleClickDateTimeNext: (availableDays) => {
      // availableDays에 day가 있으면 list에서 삭제, 없으면 추가
      const currentDays = get().availableDays;
      const dayIndex = currentDays.findIndex(
        (day) => day.day === availableDays.day
      );
      if (dayIndex > -1) {
        // 이미 선택된 요일인 경우 제거
        currentDays.splice(dayIndex, 1);
      } else {
        // 선택되지 않은 요일인 경우 추가
        currentDays.push(availableDays);
      }
      set({ availableDays: currentDays });
    },

    canGoToNextStep: (currentStep: string) => {
      const state = get();
      switch (currentStep) {
        case "certification":
          return !!state.selectedCertification;
        case "book":
          return !!state.selectedCertification && !!state.selectedBook;
        case "date":
          return (
            !!state.selectedCertification &&
            !!state.selectedBook &&
            !!state.examDate
          );
        case "time":
          return (
            !!state.selectedCertification &&
            !!state.selectedBook &&
            !!state.examDate &&
            !!state.availableDays
          );
        case "confirm":
          return (
            !!state.selectedCertification &&
            !!state.selectedBook &&
            !!state.examDate &&
            !!state.availableDays &&
            Object.keys(state.subjectLevel).length > 0
          );
        default:
          return false;
      }
    },
  })
);
