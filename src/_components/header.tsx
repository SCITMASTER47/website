"use client";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import useAuthStore from "@/_store/auth";
import { useMemo } from "react";
import CertifyLogo from "@/_ui/logo/logo";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuthStore();
  const currentUserState = useMemo(() => {
    return user;
  }, [user]);

  return (
    <header className="fixed top-0 bg-white h-14 w-full  border-b border-b-border/50 px-4 flex items-center justify-between gap-4">
      <Link href={"/"} className="flex items-center ">
        <CertifyLogo />
        <div className="font-bold text-lg">プレナ</div>
      </Link>
      <div>
        {currentUserState ? (
          <div className="relative group">
            <AccountCircleIcon
              className="text-gray-500 cursor-pointer"
              fontSize="large"
            />
            {/* hover 하면 user email, 로그아웃 버튼 보이기 */}

            <div className="absolute right-0 mt-2 w-48  flex flex-col items-center gap-2 bg-white border border-border rounded-xl shadow-lg p-4 invisible opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <div className="w-full flex gap-2 items-center justify-between">
                <AccountCircleIcon
                  className="text-gray-500 cursor-pointer"
                  fontSize="medium"
                />
                <div className="text-sm  font-bold text-gray-700 ">
                  {currentUserState.email}
                </div>
              </div>
              <div className="border-t border-border w-full " />
              <button
                className="w-full flex gap-2 items-center justify-between transition-all hover:scale-95 active:scale-90"
                onClick={() => {
                  logout();
                }}
              >
                <ExitToAppIcon />
                <div className="text-center text-sm  font-bold text-gray-700 ">
                  로그아웃
                </div>
              </button>
            </div>
          </div>
        ) : (
          <button>로그인</button>
        )}
      </div>
    </header>
  );
}
