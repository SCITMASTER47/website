import { UserLoginRequest, UserSignUpRequest } from "@/_types/auth";
import { deleteJwtFromServer, setJwtCookie } from "@/_utils/cookie";

/**
 * 로그인 액션: 토큰을 받아 쿠키에 설정
 * @param data JWT 토큰
 */
export const loginAction = async (data: UserLoginRequest): Promise<void> => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
    const tmpToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDMiLCJlbWFpbCI6InRlc3QyMTNAdGVzdC5jb20iLCJpYXQiOjE3NTc0NjY5ODEsImV4cCI6MTc1ODMzMDk4MX0.4Gvq-z2B1rhzynTAIQA2dxxhSod8oFLbrQXJ1vBGr1w";
    await new Promise((resolve) => setTimeout(resolve, 500));
    await setJwtCookie(tmpToken);
    return;
  }
  //   await setJwtCookie(token);
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
export const signUpAction = async (data: UserSignUpRequest): Promise<void> => {
  if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }
  //   await setJwtCookie(token);
};
