export interface PageResponse<T> {
  items: T[];
  pagination: PageNation;
}

export interface PageNation {
  total: number;
  size: number;
  totalPages: number;
  page: number;
}
