import { UserLoginRequest, UserSignUpRequest } from "@/_types/auth";
import { deleteJwtFromServer, setJwtCookie } from "@/_utils/cookie";

/**
 * 로그인 액션: 토큰을 받아 쿠키에 설정
 * @param data JWT 토큰
 */
export const loginAction = async (_data: UserLoginRequest): Promise<void> => {
  try {
    if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
      const tmpToken =
        "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDMiLCJlbWFpbCI6InRlc3QyMTNAdGVzdC5jb20iLCJpYXQiOjE3NTc0NjY5ODEsImV4cCI6MTc1ODMzMDk4MX0.4Gvq-z2B1rhzynTAIQA2dxxhSod8oFLbrQXJ1vBGr1w";

      await setJwtCookie(tmpToken);
      return;
    }
    const url = new URL("/api/auth/login", process.env.NEXT_PUBLIC_BASE_URL);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_data),
      credentials: "include", // 쿠키 포함 요청/응답
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }
    const resJson = await res.json();

    const token = resJson.data.accessToken;
    await setJwtCookie(token);
  } catch (error) {
    console.error("Login action failed:", error);
    throw error;
  }
};

/**
 * 로그아웃 액션: 쿠키에서 토큰 삭제
 */
export const logoutAction = async (): Promise<void> => {
  await deleteJwtFromServer();
};

/**
 * 로그인 액션: 토큰을 받아 쿠키에 설정
 * @param data JWT 토큰
 */
export const signUpAction = async (_data: UserSignUpRequest): Promise<void> => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }
  try {
    const url = new URL("/api/auth/signup", process.env.NEXT_PUBLIC_BASE_URL);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(_data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Sign up failed");
    }
    const resJson = await res.json();

    console.log("Sign up successful:", resJson);
  } catch (error) {
    console.error("Sign up action failed:", error);
    throw error;
  }
};

export async function googleSignIn() {
  try {
    await googleLogin();
  } catch {
    throw new Error("Google OAuth 실패");
  }
}
export async function googleLogin() {
  try {
    const url = new URL("/api/auth/google", process.env.NEXT_PUBLIC_BASE_URL);
    const callbackUrl = `${process.env.NEXT_PUBLIC_LOCAL_URL}/auth/login`;
    url.searchParams.append("clientCallbackUri", callbackUrl);
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // 쿠키 포함 요청/응답
    });
    const resJson = await res.json();

    const authUrl = resJson.data.authUrl;
    window.location.href = authUrl;
  } catch {
    throw new Error("Google OAuth 실패");
  }
}
