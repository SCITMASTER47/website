"use client";

import { useEffect, useMemo } from "react";
import useAuthStore from "@/_store/auth";
import { usePathname } from "next/navigation";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 요청 확인 제외 경로 설정
  const excludedPaths = useMemo(() => ["/auth/login", "/auth/signUp", "/"], []);

  const currentPath = usePathname();
  const isExcluded = useMemo(() => {
    return excludedPaths.some((path) => currentPath === path);
  }, [currentPath, excludedPaths]);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  // 제외 경로가 아닐 때만 checkAuth 실행
  useEffect(() => {
    if (!isExcluded) {
      checkAuth();
    }
  }, [checkAuth, isExcluded]);
  // 현재 경로가 제외 경로에 포함되는지 확인

  return <>{children}</>;
}
