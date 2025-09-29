import { create } from "zustand";
import {
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
  weekdays: WeekDay[];
  stepInfo: ProgressBarItem[];
  loading: boolean;
  progressBarErrorMessage: string | null;
  reset: () => void;
  handleSelectCert: (certification: Certification) => string;
  handleExamDateChange: (date: Date | null) => string;
  handleBookSelect: (book: Book) => string;
  handleSubjectLevelChange: (subjectLevel: {
    [key: string]: "초급" | "중급" | "고급" | null;
  }) => void;
  setFocusNotes: (notes: string) => void;
  handleClickDateTimeNext: (availableDays: Record<string, number>) => void;
  onSubmit: (prompt: string | undefined) => Promise<string>;
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
    currentStepId: "certification",
    stepInfo: defaultStepText,
    weekdays: weekdays,
    loading: false,
    progressBarErrorMessage: null,
    reset: () => {
      //cookie 모두 reset
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_license_id=; path=/; max-age=0`;
        document.cookie = `create_schedule_license_title=; path=/; max-age=0`;
        document.cookie = `create_schedule_proficiency=; path=/; max-age=0`;
        document.cookie = `create_schedule_exam_date=; path=/; max-age=0`;
        document.cookie = `create_schedule_book_id=; path=/; max-age=0`;
        document.cookie = `create_schedule_book_title=; path=/; max-age=0`;
        document.cookie = `create_schedule_available_days=; path=/; max-age=0`;
      }
    },
    handleSelectCert: (certification: Certification) => {
      // Cookie에 저장
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_license_id=${JSON.stringify(
          certification
        )}; path=/; max-age=86400`;
        document.cookie = `create_schedule_license_title=${encodeURIComponent(
          certification.title
        )}; path=/; max-age=86400`;
        document.cookie = `create_schedule_proficiency=; path=/; max-age=0`;
      }
      return (
        `${get().stepInfo[0].nextUrl}?cid=${certification.id}` || "/create/book"
      );
    },
    handleExamDateChange: (date: Date | null) => {
      const exam_date = date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0]
        : "";

      if (exam_date === "") return "#";

      // Cookie에 저장
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_exam_date=${exam_date}; path=/; max-age=86400`;
      }

      return get().stepInfo[2].nextUrl || "/create/time";
    },
    handleBookSelect: (book: Book) => {
      // Cookie에 저장
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_book_id=${book.id}; path=/; max-age=86400`;
        document.cookie = `create_schedule_book_title=${encodeURIComponent(
          book.title
        )}; path=/; max-age=86400`;
      }
      return get().stepInfo[1].nextUrl || "/create/date";
    },

    handleSubjectLevelChange: (subjectLevel: {
      [key: string]: "초급" | "중급" | "고급" | null;
    }) => {
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_proficiency=${encodeURIComponent(
          JSON.stringify(subjectLevel)
        )}; path=/; max-age=86400`;
      }
    },
    setFocusNotes: (notes: string) => {},
    onSubmit: async (prompt: string | undefined) => {
      try {
        set({ loading: true });
        // cookie 에서 정보 가져와  ScheduleCreateRequest 형태로 만들기
        const licenseCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_license_id="))
          ?.split("=")[1];
        const license = JSON.parse(
          decodeURIComponent(licenseCookie || "")
        ) as Certification;
        const examDateCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_exam_date="))
          ?.split("=")[1];
        const bookIdCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_book_id="))
          ?.split("=")[1];
        const availableDaysCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_available_days="))
          ?.split("=")[1];
        const availableDays = JSON.parse(
          decodeURIComponent(availableDaysCookie!)
        ) as { [key: string]: number };
        const proficiencyCookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith("create_schedule_proficiency="))
          ?.split("=")[1];

        if (
          license &&
          examDateCookie &&
          bookIdCookie &&
          availableDaysCookie &&
          proficiencyCookie
        ) {
          const formData: ScheduleCreateRequest = {
            licenseId: license.id,
            examDate: decodeURIComponent(examDateCookie),
            bookId: JSON.parse(decodeURIComponent(bookIdCookie)),
            availableDays: Object.keys(availableDays).filter(
              (key) => key !== "total" && availableDays[key] > 0
            ),
            proficiency: JSON.parse(decodeURIComponent(proficiencyCookie)),
            userPrompt: prompt ?? "",
            targetHour: availableDays["total"],
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
      // 선택된 요일과 목표 시간을 쿠키에 저장
      if (typeof window !== "undefined") {
        document.cookie = `create_schedule_available_days=${JSON.stringify(
          availableDays
        )}; path=/; max-age=86400`;
      }
    },
  })
);
