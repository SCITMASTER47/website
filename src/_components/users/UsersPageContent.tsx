"use client";

import { useState, useEffect, useCallback } from "react";
import useUserStore from "@/_store/user";
import UserSearch from "./UserSearch";
import UserList from "./UserList";

import { getAllUsers } from "@/_action-server/user";
import { User } from "@/_types/user";

import PeopleIcon from "@mui/icons-material/People";
import StarIcon from "@mui/icons-material/Star";

export default function UsersPageContent() {
  const {
    users,
    selectedUser,
    isLoadingUsers,
    setUsers,
    setSelectedUser,
    setLoadingUsers,
    setSearchQuery,
    toggleFavorite,
    isFavorite,
  } = useUserStore();

  const [searchResults, setSearchResults] = useState<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<"all" | "friend">("all");

  const loadAllUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const result = await getAllUsers();
      setUsers(result.users);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [setLoadingUsers, setUsers]);

  // 초기 사용자 목록 로드
  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

  // 사용자 검색 처리 (로컬 필터링)
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setSearchResults(null);
        return;
      }

      // 로컬에서 이메일로 필터링
      const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        users: filteredUsers,
        total: filteredUsers.length,
        page: 1,
        limit: filteredUsers.length,
      });
    },
    [setSearchQuery, users]
  );

  // 즐겨찾기 토글 처리
  const handleToggleFavorite = async (user: User) => {
    try {
      await toggleFavorite(user);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  // 현재 보여줄 사용자 목록 결정
  const currentUsers = (() => {
    if (activeTab === "friend") {
      if (searchResults && searchResults.users.length > 0) {
        // 즐겨찾기 탭 + 검색 결과가 있는 경우
        return searchResults.users.filter((user) => user.favorite);
      }
      return users.filter((user) => user.favorite);
    } else if (searchResults && searchResults.users.length > 0) {
      // 검색 결과가 있는 경우
      return searchResults.users;
    } else {
      // 기본: 전체 사용자
      return users;
    }
  })();

  return (
    <div className="h-full w-full flex flex-col">
      {/* 왼쪽 패널 - 사용자 검색 및 목록 */}

      {/* 검색 */}
      <div className="mb-6">
        <UserSearch
          onSearch={handleSearch}
          isLoading={false}
          placeholder="이메일로 사용자 검색..."
        />
      </div>

      {/* 탭 */}
      <div className="mb-4">
        <div className="flex gap-2">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            icon={<PeopleIcon className="text-sm" />}
            label="전체 사용자"
            count={users.length}
          />
          <TabButton
            active={activeTab === "friend"}
            onClick={() => setActiveTab("friend")}
            icon={<StarIcon className="text-sm" />}
            label="즐겨찾기"
            count={users.filter((user) => user.favorite).length}
            disabled={false}
          />
        </div>
      </div>

      {/* 사용자 목록 */}
      <div className="flex-1 overflow-y-auto">
        <UserList
          users={currentUsers}
          onToggleFavorite={handleToggleFavorite}
          onSelectUser={handleSelectUser}
          selectedUserId={selectedUser?.id}
          isLoading={isLoadingUsers}
          showFavoriteButton={true}
        />
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  disabled?: boolean;
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
  disabled,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
        active
          ? "border-primary bg-primary text-white"
          : disabled
          ? "border-gray-200 text-gray-400 cursor-not-allowed"
          : "border-border/50 text-gray-700 hover:border-primary/50 hover:text-primary"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
