"use server";

import { User, UserSearchResult, UserSchedule } from "@/_types/user";
import { getJwtFromCookie } from "@/_utils/cookie";

/**
 * 모든 사용자 목록 조회
 */
export async function getAllUsers(): Promise<UserSearchResult> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL("/api/users", process.env.NEXT_PUBLIC_LOCAL_URL);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: ["users"], revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("사용자 목록을 가져올 수 없습니다");
    }

    const resJson = await response.json();

    if (resJson.status !== "ok") {
      throw new Error("사용자 목록을 가져올 수 없습니다");
    }

    return {
      users: resJson.data as User[],
      page: 1,
      total: resJson.data.length,
      limit: 10,
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { users: [], page: 1, total: 0, limit: 10 };
  }
}

/**
 * 사용자 검색
 */
export async function searchUsers(
  query: string,
  page = 1,
  limit = 10
): Promise<UserSearchResult> {
  return getAllUsers();
}

/**
 * 사용자의 스케줄 목록 조회
 */
export async function getUserSchedules(userId: string): Promise<UserSchedule> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(
      `/api/users/${userId}/schedules`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("사용자 스케줄을 가져올 수 없습니다");
    }

    const resJson = await response.json();
    if (resJson.status !== "ok") {
      throw new Error("사용자 스케줄을 가져올 수 없습니다");
    }

    return resJson.data as UserSchedule;
  } catch (error) {
    console.error("Failed to fetch user schedules:", error);
    return { id: userId, email: "", schedules: [] };
  }
}

/**
 * 즐겨찾기 목록 조회
 */
export async function getFavoriteUsers(): Promise<User[]> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(
      "/api/users/favorites",
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("즐겨찾기 목록을 가져올 수 없습니다");
    }

    const resJson = await response.json();
    if (resJson.status !== "ok") {
      throw new Error("즐겨찾기 목록을 가져올 수 없습니다");
    }

    return resJson.data as User[];
  } catch (error) {
    console.error("Failed to fetch favorite users:", error);
    return [];
  }
}
