import { connectSSE, saveSchedule } from "@/_action/schedule";
import { Chat, Version } from "@/_types/chat";
import { TodoProps } from "@/_types/schedule";
import { SSEOnEndEvent, SSEOnStartEvent } from "@/_types/sse";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { revalidateSchedules } from "@/_action-server/schedule";
interface AIChatState {
  prompt: string;
  chats: Chat<string>[];
  todos: TodoProps[];
  versions: Version[];
  isGenerating: boolean;
  currentVersionId: string | undefined;
  sessionId: string | undefined;
  setDefaultChat: (chats: Chat<string>[]) => void;
  setDefaultVersions: (versions: Version[]) => void;
  setPrompt: (value: string) => void;
  onAIPageLoad: (
    chats: Chat<string>[],
    versions: Version[],
    sessionId: string
  ) => Promise<void>;
  generateAIResponse: () => void;
  handleVersionChange: (versionId: string) => Promise<void>;
  onSaveSchedule: () => Promise<string>;
}

export const useAIChatStore = create<AIChatState>((set, get) => ({
  prompt: "",
  chats: [],
  todos: [],
  versions: [],
  isGenerating: false,
  currentVersionId: undefined,
  sessionId: undefined,
  setDefaultChat: (chats: Chat<string>[]) => set({ chats: chats }),
  setDefaultVersions: (versions: Version[]) =>
    set({
      versions: versions,
      currentVersionId: versions[versions.length - 1]?.versionId || undefined,
      todos: versions[versions.length - 1]?.studyPlan || [],
    }),
  setSessionId: (id: string) => set({ sessionId: id }),
  setPrompt: (value) => set({ prompt: value }),
  onAIPageLoad: async (chats, versions, sessionId) => {
    set({ sessionId });
    get().setDefaultChat(chats);
    get().setDefaultVersions(versions);
    get().generateAIResponse();
  },
  generateAIResponse: async () => {
    if (get().isGenerating) return;
    const { prompt, chats, sessionId, currentVersionId, setPrompt } = get();
    // 사용자 메시지 추가
    const newChat: Chat<string> = {
      uuid: Date.now().toString(),
      role: "user",
      message: prompt,
      timestamp: new Date(),
    };
    set({ chats: [...chats, newChat], isGenerating: true });
    setPrompt("");
    let eventSource: EventSource | null = null;
    let todoBuffer = "";
    if (!eventSource) {
      const url: URL = new URL(
        `/api/ai/schedules/sessions/${sessionId}`,
        process.env.NEXT_PUBLIC_BASE_URL
      );
      if (prompt) {
        url.searchParams.append("prompt", prompt);
      }
      if (currentVersionId) {
        url.searchParams.append("lastestVersion", currentVersionId);
      }

      const objectStack: number[] = [];
      let startParsing = false;
      eventSource = await connectSSE({
        url: url,
        onConnect: (ev: MessageEvent<SSEOnStartEvent>) => {
          set({ isGenerating: true, todos: [] });
          const tmpVersionId = uuidv4();
          //version 추가
          set((state) => ({
            versions: [
              ...state.versions,
              {
                versionId: tmpVersionId,
                summary: `생성중...`,
                title: `생성중...`,
                studyPlan: [],
                createdAt: new Date().toISOString(),
              },
            ],
            currentVersionId: tmpVersionId,
          }));
        },
        onChatMessage: (data: MessageEvent) => {
          // 채팅 메시지 누적 처리

          set((state) => {
            const lastAI =
              state.chats.length > 0 &&
              state.chats[state.chats.length - 1].role === "ai"
                ? state.chats[state.chats.length - 1]
                : null;
            const updatedChats = [...state.chats];
            if (lastAI) {
              updatedChats[updatedChats.length - 1] = {
                ...lastAI,
                message: lastAI.message + data.data,
              };
            } else {
              updatedChats.push({
                uuid: Date.now().toString() + "-ai",
                role: "ai",
                message: data.data,
                timestamp: new Date(),
              });
            }
            return { chats: updatedChats, isGenerating: true };
          });
        },
        onTodoMessage: (event: MessageEvent<string>) => {
          // 1글자씩 들어오는 JSON을 버퍼에 누적
          todoBuffer += event.data;

          // 중첩 객체까지 올바르게 파싱하기 위해 objectStack으로 깊이 추적
          for (let i = 0; i < event.data.length; i++) {
            const char = event.data[i];
            if (char === "[" && !startParsing) {
              startParsing = true;
              const objIndex = todoBuffer.indexOf("[");
              todoBuffer = todoBuffer.slice(objIndex + 1);
            }
            if (startParsing) {
              if (char === "{") {
                const objIndex = todoBuffer.indexOf("{");
                objectStack.push(objIndex);
              } else if (char === "}") {
                const lastObjEnd = todoBuffer.lastIndexOf("}");
                const firstObjStart = objectStack.pop();

                // stack이 0이 되면 완성된 객체
                if (objectStack.length === 0) {
                  if (
                    firstObjStart &&
                    firstObjStart !== -1 &&
                    lastObjEnd !== -1 &&
                    lastObjEnd > firstObjStart
                  ) {
                    const jsonStr = todoBuffer.slice(
                      firstObjStart,
                      lastObjEnd + 1
                    );

                    try {
                      const newTodo = JSON.parse(jsonStr) as TodoProps;
                      console.log("Parsed new todo:", newTodo);
                      set((state) => ({ todos: [...state.todos, newTodo] }));
                    } catch {
                      // 파싱 실패 시 무시
                    }
                    // 버퍼에서 해당 객체 부분 제거
                    todoBuffer = todoBuffer.slice(lastObjEnd + 1);
                  }
                }
              }
            }
          }
        },
        onEndMessage: (event: SSEOnEndEvent) => {
          startParsing = false;
          todoBuffer = "";
          // 마지막 AI 메시지에 마침표 찍기

          const versions = get().versions;
          if (versions.length > 0) {
            // 마지막 버전의 summary, title, versionId 업데이트
            const lastIndex = versions.length - 1;
            const updatedVersions = [...versions];
            updatedVersions[lastIndex] = {
              ...updatedVersions[lastIndex],
              versionId: event.newVersion,
              summary: event.summary,
              studyPlan: get().todos,
            };

            set({
              versions: updatedVersions,
              isGenerating: false,
              currentVersionId: event.newVersion,
            });
          }

          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
        },
        onError: (error: Event) => {
          const versions = get().versions;
          if (versions.length > 0) {
            versions.pop();
          }
          set((state) => ({
            ...state,
            isGenerating: false,
            todos: [],
            versions: versions,
          }));
          if (eventSource) {
            eventSource.close();
            eventSource = null;
          }
        },
      });
    }
  },
  onSaveSchedule: async () => {
    try {
      const { sessionId, currentVersionId } = get();
      if (!sessionId || !currentVersionId) {
        return "#";
      }
      await saveSchedule(sessionId, currentVersionId);
      await revalidateSchedules();
      return "/dashboard";
    } catch (error) {
      console.error("Error saving schedule:", error);
      return "#";
    }
  },
  handleVersionChange: async (versionId: string) =>
    // 버전 변경 시 해당 버전의 todos로 업데이트
    set(() => ({
      currentVersionId: versionId,
      todos:
        get().versions.find((v) => v.versionId === versionId)?.studyPlan || [],
    })),
}));
