export {};

declare global {
  interface EventSourceEventMap {
    START: MessageEvent;
    CHAT_CHUNK: MessageEvent<string>;
    PLAN_CHUNK: MessageEvent<string>;
    COMPLETE: MessageEvent;
  }
}
