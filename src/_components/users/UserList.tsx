"use client";

import { User } from "@/_types/user";
import { useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { useRouter } from "next/navigation";
import { on } from "events";

interface UserListProps {
  users: User[];
  onToggleFavorite?: (user: User) => void;
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
  showFavoriteButton?: boolean;
  isLoading?: boolean;
}

export default function UserList({
  users,
  onToggleFavorite,
  onSelectUser,
  selectedUserId,
  showFavoriteButton = true,
  isLoading = false,
}: UserListProps) {
  const [togglingFavorites, setTogglingFavorites] = useState<Set<string>>(
    new Set()
  );
  const router = useRouter();
  const handleClickUser = (user: User) => {
    onSelectUser(user);
    router.push(`/users/${user.id}`);
  };
  const handleToggleFavorite = async (user: User) => {
    if (!onToggleFavorite) return;

    setTogglingFavorites((prev) => new Set([...prev, user.id]));
    try {
      await onToggleFavorite(user);
    } finally {
      setTogglingFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(user.id);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return <UserListSkeleton />;
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <PersonIcon className="text-4xl mb-2 opacity-50" />
        <p className="text-sm">사용자를 찾을 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isSelected={selectedUserId === user.id}
          isFavorite={user.favorite ?? false}
          onSelect={() => handleClickUser(user)}
          onToggleFavorite={
            showFavoriteButton ? () => handleToggleFavorite(user) : undefined
          }
          isToggling={togglingFavorites.has(user.id)}
        />
      ))}
    </div>
  );
}

interface UserCardProps {
  user: User;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
  isToggling?: boolean;
}

function UserCard({
  user,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  isToggling,
}: UserCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* 아바타 */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <PersonIcon className="text-primary text-xl" />
          </div>

          {/* 사용자 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {/* 사용자 {user.id.slice(-4)} */}
              </h3>
              {isFavorite && (
                <StarIcon className="text-yellow-500 text-sm flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
              <EmailIcon className="text-xs" />
              <span className="truncate">{user.email}</span>
            </div>
          </div>
        </div>

        {/* 즐겨찾기 버튼 */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            disabled={isToggling}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            {isToggling ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : isFavorite ? (
              <StarIcon className="text-yellow-500 text-xl" />
            ) : (
              <StarBorderIcon className="text-gray-400 text-xl hover:text-yellow-500 transition-colors" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-xl border border-gray-200 animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-300" />
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-24 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-32" />
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
