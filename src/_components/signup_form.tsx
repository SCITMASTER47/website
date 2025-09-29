"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/_store/auth";
import { UserLoginRequest } from "@/_types/auth";
import { createFormUpdater, resetForm } from "@/_utils/form";

interface SignUpFormProps {
  error?: string;
  token?: string;
}

export default function SignUpForm({
  error: serverError,
  token,
}: SignUpFormProps) {
  const { isLoading, error, signUp, onGoogleLoginCallback } = useAuthStore();
  const [formData, setFormData] = useState<UserLoginRequest>({
    email: "",
    password: "",
  });
  const router = useRouter();

  // URL에서 받은 token이 있으면 자동 로그인 처리
  useEffect(() => {
    if (!token) return;
    onGoogleLoginCallback(token, serverError);
  }, [token, serverError, onGoogleLoginCallback]);

  const updateFormData = createFormUpdater(setFormData);

  // 폼 초기화 함수
  const handleResetForm = () => {
    resetForm(setFormData, {
      email: "",
      password: "",
    });
  };
  // 개발 편의를 위한 더미 데이터 자동 입력 (개발 환경에서만)
  const fillDummyData = () => {
    if (process.env.NODE_ENV === "development") {
      resetForm(setFormData, {
        email: "test213@test.com",
        password: "test",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      await signUp(formData);
      handleResetForm();
      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      router.replace("/auth/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full   flex flex-col gap-6 ">
      <h2 className="text-2xl font-bold text-primary mb-2 text-center">
        회원가입
      </h2>

      <input
        type="text"
        placeholder="이메일"
        value={formData.email}
        onChange={(e) => updateFormData("email", e.target.value)}
        className="border border-primary bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
        required
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={formData.password}
        onChange={(e) => updateFormData("password", e.target.value)}
        className="border border-primary bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
        required
        disabled={isLoading}
      />

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      {/* 개발 환경에서만 더미 데이터 버튼 표시 */}

      <button
        type="submit"
        disabled={isLoading}
        className="bg-primary text-white py-2 rounded-2xl font-semibold shadow hover:bg-primary/80 transition disabled:opacity-50"
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
