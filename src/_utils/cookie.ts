"use server";

import { Session } from "@/_types/auth";
// 서버 사이드 전용 쿠키 유틸리티
import { cookies } from "next/headers";

/**
 * 서버 사이드에서 JWT 토큰 가져오기 (Server Components/Actions용)
 * @return JWT 토큰 문자열
 */
export const getJwtFromCookie = async (): Promise<string> => {
  try {
    const cookieStore = await cookies();
    const jwtFromCookies = cookieStore.get("access_token")?.value;
    if (jwtFromCookies) {
      return jwtFromCookies;
    } else {
      console.log("No access_token cookie found");
      throw new Error("cookie에 Token이 존재하지 않습니다.");
    }
  } catch {
    console.log("No access_token cookie found");
    throw new Error("JWT Token을 가져오지 못했습니다.");
  }
};

/**
 * 서버 사이드에서 JWT 토큰 유효성 검사
 * @param token
 */
export const checkValidateJwtOnServer = async (
  token: string
): Promise<void> => {
  try {
    // JWT는 3개의 부분으로 구성됨 (header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("유효하지 않은 JWT 토큰입니다.");
    }
    // payload 디코딩해서 만료시간 확인
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    // exp가 있으면 만료시간 확인, 없으면 유효하다고 가정
    if (payload.exp && payload.exp < currentTime) {
      throw new Error("JWT Token이 만료되었습니다.");
    }
  } catch {
    throw new Error("JWT Token을 검증하지 못했습니다.");
  }
};

/**
 * 서버 사이드에서 JWT 쿠키 삭제하기
 */
export const deleteJwtFromServer = async (): Promise<void> => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
  } catch {
    throw new Error("JWT Token을 삭제하지 못했습니다.");
  }
};

/**
 * 서버 사이드에서 JWT 쿠키 설정하기
 * @param token
 *
 */
export const setJwtCookie = async (token: string): Promise<void> => {
  try {
    const cookieStore = await cookies();
    const jwtPayload = JSON.parse(atob(token.split(".")[1]));
    const exp = jwtPayload.exp * 1000; // ms로 변환
    cookieStore.set("access_token", token, {
      path: "/",
      expires: new Date(exp),
    });
  } catch {
    throw Error("JWT토큰을 저장하는데 실패하였습니다.");
  }
};

/**
 * JWT 토큰에서 id, email 추출
 * @param token
 * @return User 정보
 */
export const getUserInfoFromJwt = async (token: string): Promise<Session> => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: payload.sub,
      email: payload.email,
    };
  } catch {
    throw Error("유효하지 않은 JWT");
  }
};
