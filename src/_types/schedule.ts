export interface ScheduleCreateRequest {
  licenseId: string;
  examDate: string;
  bookId: string;
  availableDays: string[];
  proficiency: {
    [key: string]: "초급" | "중급" | "고급";
  };
  userPrompt: string;
  targetHour: number;
}

export interface ScheduleResponse {
  plan_id: string;
  license_id: string;
  exam_date: string;
  timezone: string;
  generated_tasks: Task[];
  summary: ScheduleSummary;
  created_at: string;
}
export interface Schedule {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  title: string;
}
export interface Task {
  task_id: string;
  date: string;
  subject: string;
  title: string;
  expected_minutes: number;
  time_block: string;
}

export interface ScheduleSummary {
  total_days: number;
  total_expected_hours: number;
  coverage: {
    [key: string]: number;
  };
}

export interface Certification {
  id: string;
  title: string;
  description: string;
  subjects: Subject[];
  imgUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
}
export interface Page<T> {
  pagination: Pagination;
  data: T[];
}
export interface Pagination {
  page: number;
  size: number;
  total: number;
}
export interface Book {
  id: string;
  title: string;
  company_name: string;
  imgUrl?: string;
  certificate_id: string;
  user_id?: string;
}

export interface WeekDay {
  id: string;
  value: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  label: string;
}

export interface MonthlySchedule {
  [date: string]: MonthlyTodo[];
}
export interface MonthlyTodo {
  // id: string;
  subject: string;
  duration: number;
}

export interface TodoProps {
  id: number;
  date: string;
  chapter: string;
  startPage: string;
  endPage: string;
  keyword: string[];
  minute: string;
  notes: string;
  studyGoal: string;
  isDone: boolean;
}

export interface Subject {
  id: string;
  name: string;
}
