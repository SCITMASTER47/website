import { Chat, Version } from "@/_types/chat";
import { getJwtFromCookie } from "@/_utils/cookie";

/**
 *  @param chatId
 *  @returns chat history
 */
export async function getChatHistory(chatId: string): Promise<Chat<string>[]> {
  try {
    const token = await getJwtFromCookie();
    const url = new URL(
      `/api/AI/chatHistory/${chatId}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("AI 채팅불러오기 실패");
    }
    const resJson = await res.json();
    if (resJson.status !== "ok") {
      throw new Error("AI 채팅불러오기 실패");
    }
    return resJson.data;
  } catch (error) {
    console.error("Failed to fetch chat history:", error);
    // 쿠키가 없거나 인증에 실패한 경우 빈 배열 반환
    return [];
  }
}

/**
 *  @param chatId
 *  @returns versions
 */
export async function getVersions(chatId: string): Promise<Version[]> {
  try {
    const token = await getJwtFromCookie();

    const url = new URL(
      `/api/AI/version/${chatId}`,
      process.env.NEXT_PUBLIC_LOCAL_URL
    );

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("AI 버전불러오기 실패");
    }
    const resJson = await res.json();
    if (resJson.status !== "ok") {
      throw new Error("AI 버전불러오기 실패");
    }
    return [];
    return resJson.data;
  } catch (error: unknown) {
    return [];
    throw new Error("AI 버전불러오기 실패");
  }
}
