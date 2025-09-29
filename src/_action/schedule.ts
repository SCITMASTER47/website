import { ScheduleCreateRequest } from "@/_types/schedule";
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
  onEndMessage: (event: SSEOnEndEvent) => void;
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

  // EventSource 생성
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
  eventSource.addEventListener("COMPLETE", (event: MessageEvent<string>) => {
    console.log("SSE COMPLETE 이벤트 수신:", event.data);
    const messageParse = JSON.parse(event.data) as SSEOnEndEvent;
    onEndMessage(messageParse);
    eventSource.close();
  });
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
 * @param scheduleForm
 * @param token
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
    return resJson.data as createAISessionResponse;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }
}

/**
 *
 * @param scheduleForm
 * @param token
 * @returns AI chatroomId
 */
export async function saveSchedule(
  sessionId: string,
  versionId: string
): Promise<void> {
  try {
    const headers = await getJwtFromCookie();
    if (!headers) {
      throw new Error("No access_token cookie found");
    }

    const url = new URL(
      "/api/schedules/confirm",
      process.env.NEXT_PUBLIC_BASE_URL
    );
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${headers}`,
      },
      body: JSON.stringify({ sessionId, versionId }),
    });
    console.log("save Schedule Response:", res);
    if (!res.ok) {
      throw new Error("Failed to create schedule");
    }

    const resJson = await res.json();
    if (resJson?.status != "ok") {
      throw new Error(resJson?.message || "Failed to create schedule");
    }
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }
}
