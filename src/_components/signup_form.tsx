"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/_store/auth";
import { UserSignUpRequest } from "@/_types/auth";
import { createFormUpdater, isFormValid, resetForm } from "@/_utils/form";

export default function SignupForm() {
  const { isLoading, error, signUp } = useAuthStore();
  const [formData, setFormData] = useState<UserSignUpRequest>({
    email: "",
    password: "",
  });
  const router = useRouter();

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
    e.preventDefault();
    await signUp(formData);
    handleResetForm();
    router.replace("/auth/login");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full p-8  rounded-3xl shadow flex flex-col gap-6 border border-primary"
    >
      <h2 className="text-2xl font-bold text-primary mb-2 text-center">
        회원가입
      </h2>

      {/* <input
          type="text"
          placeholder="이름"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          className="border border-primary bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
          required
          disabled={loading}
        /> */}

      <input
        type="email"
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
      {process.env.NODE_ENV === "development" && (
        <button
          type="button"
          onClick={fillDummyData}
          className="bg-gray-500 text-white py-1 px-3 rounded text-xs hover:bg-gray-600 transition"
        >
          더미 데이터 채우기
        </button>
      )}

      <button
        type="submit"
        disabled={isLoading || !isFormValid(formData)}
        className="bg-primary text-white py-2 rounded-2xl font-semibold shadow hover:bg-primary/80 transition disabled:opacity-50"
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </button>
    </form>
  );
}
