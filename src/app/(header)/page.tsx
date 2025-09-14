"use client";

import useAuthStore from "@/_store/auth";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useAuthStore();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-4xl font-bold text-center">
        {user ? `${user.email}님, 환영합니다!` : "환영합니다!"}
      </h1>
      {user ? (
        <button
          type="button"
          onClick={logout}
          className="bg-primary text-white py-2 px-4 rounded-2xl font-semibold shadow hover:bg-primary/80 transition"
        >
          로그아웃
        </button>
      ) : (
        <Link
          href={"/auth/login"}
          className="text-center text-muted-foreground"
        >
          로그인 후 다양한 기능을 이용해보세요!
        </Link>
      )}
      <Link href={"/dashboard"}>move</Link>
      <div className="text-xs text-muted-foreground">
        &copy; 2024 Scitmaster Team Project
      </div>
    </div>
  );
}
