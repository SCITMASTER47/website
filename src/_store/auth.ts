"use client";
import { create } from "zustand";
import { Session, UserLoginRequest, UserSignUpRequest } from "@/_types/auth";
import { loginAction, logoutAction, signUpAction } from "@/_action/auth";
import { getJwtFromCookie, getUserInfoFromJwt } from "@/_utils/cookie";
import { isFormValid } from "@/_utils/form";

interface AuthState {
  user: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (data: UserLoginRequest) => Promise<void>;
  signUp: (data: UserSignUpRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  googleLogin: () => Promise<void>;
  onGoogleLoginCallback: (token: string, error?: unknown) => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  login: async (data: UserLoginRequest) => {
    try {
      if (!isFormValid(data)) {
        set({
          user: null,
          isLoading: false,
          error: "모든 필드를 입력해주세요.",
        });
        return;
      }
      set({ isLoading: true, error: null });
      await loginAction(data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 디버깅용 딜레이
      const token = await getJwtFromCookie();
      const user: Session = await getUserInfoFromJwt(token);
      set({ user, isLoading: false, error: null });
    } catch (error) {
      console.error("Login failed:", error);
      set({ user: null, isLoading: false, error: (error as Error).message });
    }
  },
  signUp: async (data: UserSignUpRequest) => {
    try {
      if (!isFormValid(data)) {
        set({
          user: null,
          isLoading: false,
          error: "모든 필드를 입력해주세요.",
        });
        return;
      }
      set({ user: null, isLoading: true, error: null });
      await signUpAction(data);
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      console.error("Sign up failed:", error);
      set({ user: null, isLoading: false, error: (error as Error).message });
    }
  },

  logout: async () => {
    try {
      // 서버 액션 호출하여 쿠키 삭제
      await logoutAction();

      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      console.error("Logout failed:", error);
      set({ user: null, isLoading: false, error: (error as Error).message });
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await getJwtFromCookie();
      const session = await getUserInfoFromJwt(token);
      if (session) {
        set({ user: session, error: null });
      } else {
        throw new Error("유효하지 않은 session 입니다.");
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      set({ user: null, error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
  googleLogin: async () => {
    // 향후 구글 로그인 기능 추가 예정
    console.warn("Google login not implemented yet.");
  },
  onGoogleLoginCallback: async (token: string, error?: unknown) => {
    if (error) {
      console.error("Google login error:", error);
      set({ user: null, error: (error as Error).message });
      return;
    }
    if (!token) {
      console.error("No token provided from Google login.");
      set({ user: null, error: "No token provided from Google login." });
      return;
    }
    try {
      set({ isLoading: true });

      const jwtToken = await getJwtFromCookie();
      const user: Session = await getUserInfoFromJwt(jwtToken);
      set({ user, isLoading: false, error: null });
    } catch (err) {
      console.error("Google login processing failed:", err);
      set({ user: null, isLoading: false, error: (err as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAuthStore;
