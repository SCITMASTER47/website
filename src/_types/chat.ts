import { TodoProps } from "./schedule";

export interface Chat<T> {
  uuid: string;
  role: string;
  message: T;
  timestamp: Date;
}

export interface createAISessionResponse {
  chatSessionId: string;
}

export interface Version {
  versionId: string;
  summary: string;
  title: string;
  createdAt: string;
  studyPlan: TodoProps[];
}
