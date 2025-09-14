import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getJwtFromCookie,
  checkValidateJwtOnServer,
} from "./src/_utils/cookie";

// 인증이 필요한 경로
const protectedRoutes = ["/dashboard", "/create"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware activated for path:", pathname);

  if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
    return NextResponse.next();
  }

  // 보호된 경로인지 확인
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected) {
    try {
      // 쿠키에서 토큰 가져오기
      const token = await getJwtFromCookie();
      // 토큰 유효성 검사
      await checkValidateJwtOnServer(token);
      // 유효하면 통과
      return NextResponse.next();
    } catch (error) {
      console.log("Token invalid or not found:", error);
      // 유효하지 않으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 보호된 경로들만 정확히 매칭
    "/dashboard/:path*",
    "/onboarding/:path*",
    // _next, api, static 파일들은 제외
    "/((?!api|_next|static|favicon.ico|.*\\.).*)",
    // auth/ 경로는 제외
    "/auth/:path*",
  ],
};
