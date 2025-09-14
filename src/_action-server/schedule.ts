"use server";
import { books } from "@/_constant/constants";
import { PageResponse } from "@/_types/resonse";
import { Book, Certification, Schedule, TodoProps } from "@/_types/schedule";
import { getJwtFromCookie } from "@/_utils/cookie";
import { revalidateTag } from "next/cache";

/**
 *
 * @param bearer
 * @returns schedules
 */
export async function getAllSchedules(): Promise<PageResponse<Schedule>> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      "/api/study-plans?page=1&size=10&sort=updatedAt.desc",
      process.env.NEXT_PUBLIC_BASE_URL
    );

    const pageRes = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      next: { tags: ["todo"] },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!pageRes.ok) {
      throw new Error("Failed to fetch schedules");
    }
    const resJson = await pageRes.json();
    const pageResponse = resJson.data as PageResponse<Schedule>;
    // const schedules = pageResponse.items;
    return pageResponse;
    // return {
    //   id: "schedules",
    //   title: "나의 스케쥴",
    //   items: schedules.map((schedule, index) => ({
    //     id: index,
    //     displayName: schedule.title,
    //     url: `/dashboard/schedule/${schedule.id}`,
    //   })),
    // };
  } catch {
    throw new Error("Failed to fetch schedules");
  }
}
/**
 * 오늘의 TODO 가져오기
 *
 */
export async function getTodayTodos(): Promise<TodoProps[]> {
  try {
    const token = await getJwtFromCookie();
    // const today = new Date().toISOString().split("T")[0];
    const today = "2025-09-07";
    const url = new URL(
      `/api/todo/getByDate/${today}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );
    // 오늘 날짜 추가

    const pageRes = await fetch(url, {
      method: "GET",
      cache: "force-cache",
      next: { tags: [`todo${today}`, "todo"] },
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
  } catch {
    throw new Error("Failed to fetch todos");
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
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      return books;
    }
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
      cache: "force-cache",
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
