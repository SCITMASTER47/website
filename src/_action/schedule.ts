import {
  Book,
  Certification,
  MonthlySchedule,
  Page,
  ScheduleCreateRequest,
  TodoProps,
} from "@/_types/schedule";
import { SSEOnEndEvent, SSEOnStartEvent } from "@/_types/sse";
import { createAISessionResponse } from "@/_types/chat";
import { getJwtFromCookie } from "@/_utils/cookie";

/**
 * SSE 연결 및 데이터 수신 (클라이언트)
 * @param url 요청 URL
 * @param onMessage 데이터 수신 콜백
 * @returns EventSource 인스턴스
 */
export interface SSEOptions {
  url: URL;
  onConnect: (event: MessageEvent<SSEOnStartEvent>) => void;
  onChatMessage: (event: MessageEvent<string>) => void;
  onTodoMessage: (event: MessageEvent<string>) => void;
  onEndMessage: (event: MessageEvent<SSEOnEndEvent>) => void;
  onError: (error: Event) => void;
}
export async function connectSSE({
  url,
  onConnect,
  onChatMessage,
  onTodoMessage,
  onEndMessage,
  onError,
}: SSEOptions): Promise<EventSource> {
  // 토큰을 URL 쿼리 파라미터로 추가

  // const headers = getCookie("access_token");
  const headers = await getJwtFromCookie();
  url.searchParams.append("token", headers);

  const eventSource = new EventSource(url.toString());

  eventSource.addEventListener(
    "START",
    (event: MessageEvent<SSEOnStartEvent>) => {
      onConnect(event);
    }
  );
  // 채팅 수신
  eventSource.addEventListener("CHAT_CHUNK", (event: MessageEvent<string>) => {
    onChatMessage(event);
  });
  // 투두 수신
  eventSource.addEventListener("PLAN_CHUNK", (event: MessageEvent<string>) => {
    onTodoMessage(event);
  });
  // AI 완료
  eventSource.addEventListener(
    "COMPLETE",
    (event: MessageEvent<SSEOnEndEvent>) => {
      onEndMessage(event);
      eventSource.close();
    }
  );
  // 오류 처리
  eventSource.onerror = (error) => {
    onError(error);
    eventSource.close();
  };

  // 연결 성공

  return eventSource;
}

/**
 *
 * @param userLogin
 * @returns AI chatroomId
 */
export async function createSchedule(
  scheduleForm: ScheduleCreateRequest
): Promise<createAISessionResponse> {
  try {
    const headers = await getJwtFromCookie();
    if (!headers) {
      throw new Error("No access_token cookie found");
    }
    const url = new URL(
      "/api/ai/schedules/sessions",
      process.env.NEXT_PUBLIC_BASE_URL
    );
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${headers}`,
      },
      body: JSON.stringify(scheduleForm),
    });
    if (!res.ok) {
      throw new Error("Failed to create schedule");
    }

    const resJson = await res.json();
    if (resJson?.status != "ok") {
      throw new Error(resJson?.message || "Failed to create schedule");
    }
    return resJson as createAISessionResponse;
  } catch {
    throw new Error("Failed to create schedule");
  }
}

/**
 * 이번달 스케쥴 가져오기
 * @param year
 * @param month
 * @returns monthly schedule
 */
export async function getMonthlyTodos({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<MonthlySchedule> {
  const studyData = {
    "2025-09-05": [
      {
        subject: "문자·어휘 보다 엄청나게 긴 문자열이 들어옵니다.",
        duration: 30,
      },
      { subject: "문법", duration: 45 },
      { subject: "문법", duration: 45 },
      { subject: "문법", duration: 45 },
    ],
    "2024-01-16": [
      { subject: "독해", duration: 60 },
      { subject: "청해", duration: 30 },
    ],
    "2025-09-30": [
      { subject: "문법", duration: 45 },
      { subject: "모의고사", duration: 120 },
    ],
  };
  return studyData;
}
