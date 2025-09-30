"use server";

import {
  Book,
  Certification,
  MonthlySchedule,
  Schedule,
  ScheduleDetailResponse,
  TodoProps,
} from "@/_types/schedule";
import { getJwtFromCookie } from "@/_utils/cookie";
import { revalidateTag } from "next/cache";

export async function revalidateSchedules() {
  try {
    revalidateTag("schedule");
  } catch (error) {
    console.error("Failed to revalidate schedules:", error);
  }
}
/**
 *
 * @param bearer
 * @returns schedules
 */
export async function getAllSchedules(): Promise<ScheduleDetailResponse[]> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL("/api/schedule", process.env.NEXT_PUBLIC_LOCAL_URL);

    const pageRes = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["schedule"] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!pageRes.ok) {
      throw new Error("Failed to fetch schedules");
    }
    const resJson = await pageRes.json();

    const schedules = resJson.data;
    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    // 쿠키가 없거나 인증에 실패한 경우 빈 배열 반환
    return [];
  }
}
/**
 * 오늘의 TODO 가져오기
 *
 */
export async function getTodayTodos(): Promise<TodoProps[]> {
  try {
    const token = await getJwtFromCookie();
    const today = new Date().toISOString().split("T")[0];

    const url = new URL(
      `/api/todo/getByDate/${today}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );
    // 오늘 날짜 추가

    const pageRes = await fetch(url, {
      method: "GET",
      // cache: "force-cache",
      // next: { tags: [`todo${today}`, "todo"] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!pageRes.ok) {
      throw new Error("Failed to fetch schedules");
    }
    const resJson = await pageRes.json();

    if (resJson.status !== "ok") {
      throw new Error("Failed to fetch todos");
    }

    const todos = resJson.data as TodoProps[];

    return todos;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    // 쿠키가 없거나 인증에 실패한 경우 빈 배열 반환
    return [];
  }
}

/**
 * 오늘의 TODO 완료 처리
 * @param todoId
 * @returns
 */
export async function completeTodo(
  todoId: number,
  isDone: boolean,
  date?: string
): Promise<void> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(`/api/todo`, process.env.NEXT_PUBLIC_LOCAL_URL);
    const body = { id: todoId, isDone: isDone };

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error("Failed to complete todo");
    }

    // todo revalidate by tag
    revalidateTag(date ? `todo${date}` : "todo");
  } catch {
    throw new Error("Failed to complete todo");
  }
}

/**
 * 책 정보 가져오기
 * @param certificationId:string
 * @param page:number
 * @param size: number
 * @param sort:string
 * @returns books info
 * */
export async function getAllBooks(certificationId: string): Promise<Book[]> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(
      `/api/schedule/book`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );
    url.searchParams.append("certificateId", certificationId);

    const res = await fetch(url, {
      method: "GET",
      // cache: "force-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["book"] },
    });
    if (!res.ok) {
      throw new Error("자격증 불러오기 실패");
    }

    const resJson = await res.json();

    if (resJson.status !== "ok") {
      throw new Error("자격증 불러오기 실패");
    }

    return resJson.data.data;
  } catch (error: unknown) {
    return [];
  }
}

/**
 * 자격증 정보 가져오기
 * @returns certificates info
 * */
export async function getAllCertificates(): Promise<Certification[]> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(
      "/api/schedule/certification",
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const res = await fetch(url, {
      method: "GET",
      // cache: "force-cache",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["certification"] },
    });
    if (!res.ok) {
      throw new Error("자격증 불러오기 실패");
    }
    const resJson = await res.json();
    if (resJson.status !== "ok") {
      throw new Error("자격증 불러오기 실패");
    }
    return resJson.data;
  } catch (error: unknown) {
    return [];
  }
}

/**
 * userId로 스케줄 가져오기
 * @param userId
 * @returns schedules[]
 */
export async function getUserSchedules(
  userId: string
): Promise<ScheduleDetailResponse[]> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/schedule/${userId}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const pageRes = await fetch(url, {
      method: "GET",
      // next: { revalidate: 60 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!pageRes.ok) {
      throw new Error("Failed to fetch schedules");
    }
    const resJson = await pageRes.json();
    if (resJson.status !== "ok") {
      throw new Error("Failed to fetch schedules");
    }
    const pageResponse = resJson.data as ScheduleDetailResponse[];
    const schedules = pageResponse;

    return schedules;
  } catch (error) {
    console.error("Failed to fetch schedules:", error);
    // 쿠키가 없거나 인증에 실패한 경우 빈 배열 반환
    return [];
  }
}

/**
 * 특정 Schedule ID로 상세 정보 조회
 * @param scheduleId - Schedule ID
 * @returns Schedule 상세 정보
 */
export async function getScheduleById(
  scheduleId: string
): Promise<ScheduleDetailResponse | null> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      "/api/schedule/detail",
      process.env.NEXT_PUBLIC_LOCAL_URL
    );
    url.searchParams.append("scheduleId", scheduleId);

    const response = await fetch(url, {
      method: "GET",
      // cache: "force-cache",
      // next: { tags: [`schedule-${scheduleId}`] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch schedule: ${response.status}`);
    }

    const resJson = await response.json();

    return resJson.data as ScheduleDetailResponse;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
    return null;
  }
}

/**
 * Todo 완료 상태 업데이트
 * @param todoId - Todo ID
 * @param isDone - 완료 여부
 * @returns 업데이트 결과
 */
export async function updateTodoStatus(
  todoId: number,
  isDone: boolean
): Promise<boolean> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/todo/${todoId}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isDone }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo: ${response.status}`);
    }

    // 관련 schedule 캐시 무효화
    revalidateTag("schedule");

    return true;
  } catch (error) {
    console.error("Failed to update todo:", error);
    return false;
  }
}

/**
 * Todo 세부 정보 업데이트
 * @param todoId - Todo ID
 * @param prevData - 이전 데이터 (전체)
 * @param updateData - 업데이트할 데이터 (부분)
 * @returns 업데이트 결과
 */
export async function updateTodoDetails(
  todoId: number,
  prevData: TodoProps,
  updateData: Partial<
    Pick<
      TodoProps,
      | "chapter"
      | "startPage"
      | "endPage"
      | "minute"
      | "note"
      | "studyGoal"
      | "keywords"
    >
  >
): Promise<boolean> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/todo/${todoId}`,
      process.env.NEXT_PUBLIC_BASE_URL
    );

    // prevData에 updateData의 필드만 변경해서 병합
    const mergedData = {
      ...prevData,
      ...updateData, // updateData의 필드만 덮어쓰기
    };

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(mergedData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update todo details: ${response.status}`);
    }

    // 관련 schedule 캐시 무효화
    revalidateTag("schedule");

    return true;
  } catch (error) {
    console.error("Failed to update todo details:", error);
    return false;
  }
}

/**
 * Todo 삭제
 * @param todoId - Todo ID
 * @returns 삭제 결과
 */
export async function deleteTodo(todoId: number): Promise<boolean> {
  try {
    const token = await getJwtFromCookie();
    console.log("token in deleteTodo:", token);
    const url = new URL(
      `/api/todo/${todoId}`,
      process.env.NEXT_PUBLIC_BASE_URL
    );

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete todo: ${response.status}`);
    }

    // 관련 schedule 캐시 무효화
    revalidateTag("todo");

    return true;
  } catch (error) {
    console.error("Failed to delete todo:", error);
    return false;
  }
}

//**
// 해당 월의 한달 스케쥴 가져오기
// *
export async function getMonthlySchedules(
  year: number,
  month: number
): Promise<MonthlySchedule[]> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/schedule/monthly/${year}/${month}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch monthly schedules: ${response.status}`);
    }

    const resJson = await response.json();
    return resJson.data as MonthlySchedule[];
  } catch (error) {
    console.error("Failed to fetch monthly schedules:", error);
    return [];
  }
}

export async function getTodosByScheduleId(
  scheduleId: string,
  userId: string
): Promise<TodoProps[]> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/schedule/${userId}/${scheduleId}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch todos by scheduleId: ${response.status}`
      );
    }

    const resJson = await response.json();

    return resJson.data as TodoProps[];
  } catch (error) {
    console.error("Failed to fetch todos by scheduleId:", error);
    return [];
  }
}
