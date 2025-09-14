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
  // / , /auth/**
  const excludedPaths = useMemo(() => ["/auth"], []);
  // use client 에서 현제 페이지 path 가져오기

  const currentPath = usePathname();
  const isExcluded = useMemo(() => {
    return excludedPaths.some((path) => currentPath.startsWith(path));
  }, [currentPath, excludedPaths]);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    if (!isExcluded) {
      checkAuth();
    }
  }, [checkAuth, isExcluded]);
  // 현재 경로가 제외 경로에 포함되는지 확인

  return <>{children}</>;
}
