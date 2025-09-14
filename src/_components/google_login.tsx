"use client";

import useAuthStore from "@/_store/auth";
import GoogleLogo from "@/_ui/logo/google_logo";

export default function GoogleLogin() {
  const { googleLogin, isLoading } = useAuthStore();

  const handleGoogleLogin = async () => {
    await googleLogin();
  };
  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 bg-white border border-primary text-primary py-2 rounded-2xl font-semibold shadow hover:bg-muted transition disabled:opacity-50"
    >
      <GoogleLogo />
      Google로 로그인
    </button>
  );
}
