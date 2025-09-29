import { Schedule } from "./schedule";

// 사용자 정보 타입 정의
export interface User {
  id: string;
  email: string;
  favorite?: boolean;
}

// 사용자 프로필 상세 정보
export interface UserSchedule extends User {
  schedules: Schedule[];
}

// 사용자 검색 결과
export interface UserSearchResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// 사용자 검색 필터
export interface UserSearchFilter {
  query?: string;
  page?: number;
  limit?: number;
  excludeFavorites?: boolean;
  onlineOnly?: boolean;
}
