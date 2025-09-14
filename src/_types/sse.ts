export interface SSEOnStartEvent {
  conversationId: string;
  status: string;
  timestamp: string;
  eventId: string;
}
// export interface SSEOnChatMessageEvent {
//   message: string;
//   conversationId: string;
//   timestamp: string;
//   eventId: string;
// }
// export interface SSEOnTodoMessageEvent {
//   message: string;
//   conversationId: string;
//   timestamp: string;
//   eventId: string;
// }

export interface SSEOnEndEvent {
  status: string;
  conversationId: string;
  summary: string;
  timestamp: string;
  newVersion: string;
}
