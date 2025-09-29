"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "@/_hooks/useDebounce";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface UserSearchProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  isLoading?: boolean;
  showFilters?: boolean;
}

interface SearchFilters {
  onlineOnly?: boolean;
  excludeFriends?: boolean;
}

export default function UserSearch({
  onSearch,
  placeholder = "사용자 검색...",
  isLoading = false,
  showFilters = true,
}: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // 검색 실행 함수
  const handleSearch = useCallback(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  // 디바운스된 쿼리가 변경될 때 검색 실행
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClearQuery = () => {
    setQuery("");
  };

  return (
    <div className="space-y-3">
      {/* 검색 입력 필드 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
          ) : (
            <SearchIcon className="text-gray-400 text-lg" />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-3 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          {query && (
            <button
              onClick={handleClearQuery}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ClearIcon className="text-gray-400 text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 요약 */}
      {debouncedQuery && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">&ldquo;{debouncedQuery}&rdquo;</span>에
          대한 검색 결과
        </div>
      )}
    </div>
  );
}

interface FilterCheckboxProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function FilterCheckbox({
  label,
  description,
  checked,
  onChange,
}: FilterCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
      />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        {description && (
          <div className="text-xs text-gray-500 mt-1">{description}</div>
        )}
      </div>
    </label>
  );
}
