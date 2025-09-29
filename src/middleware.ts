import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getJwtFromCookie, checkValidateJwtOnServer } from "./_utils/cookie";

// 인증이 필요한 경로
const protectedRoutes = ["/dashboard", "/create", "/users", "/schedule"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("Middleware activated for path:", pathname);

  // Create 단계별 데이터 검증
  if (pathname.startsWith("/create/")) {
    const step = pathname.split("/").pop();

    // 각 단계별로 필요한 데이터 확인
    switch (step) {
      case "book":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        break;
      case "date":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        if (!request.cookies.get("create_schedule_book_id")?.value) {
          return NextResponse.redirect(new URL("/create/book", request.url));
        }

        break;
      case "time":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        if (!request.cookies.get("create_schedule_book_id")?.value) {
          return NextResponse.redirect(new URL("/create/book", request.url));
        }
        if (!request.cookies.get("create_schedule_exam_date")?.value) {
          return NextResponse.redirect(new URL("/create/date", request.url));
        }
        break;
      case "confirm":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        if (!request.cookies.get("create_schedule_book_id")?.value) {
          return NextResponse.redirect(new URL("/create/book", request.url));
        }
        if (!request.cookies.get("create_schedule_exam_date")?.value) {
          return NextResponse.redirect(new URL("/create/date", request.url));
        }

        break;
    }
  }
  if (process.env.NEXT_PUBLIC_NODE_ENV === "test") {
    return NextResponse.next();
  }
  // 보호된 경로인지 확인
  console.log("Checking if route is protected...", pathname);
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  console.log(`Is protected route: ${isProtected}`);

  // 보호된 경로라면 토큰 검사
  if (isProtected) {
    try {
      // 쿠키에서 토큰 가져오기
      const token = await getJwtFromCookie();
      // 토큰 유효성 검사
      await checkValidateJwtOnServer(token);
      // 유효하면 통과
      return NextResponse.next();
    } catch (error) {
      // 유효하지 않으면 로그인 페이지로 리다이렉트
      const loginUrl = new URL("/auth/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Create 단계별 데이터 검증
  if (pathname.startsWith("/create/")) {
    const step = pathname.split("/").pop();

    // 각 단계별로 필요한 데이터 확인
    switch (step) {
      case "date":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        break;
      case "book":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        break;
      case "time":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        if (!request.cookies.get("create_schedule_book_id")?.value) {
          return NextResponse.redirect(new URL("/create/book", request.url));
        }
        break;
      case "confirm":
        if (!request.cookies.get("create_schedule_license_id")?.value) {
          return NextResponse.redirect(
            new URL("/create/certification", request.url)
          );
        }
        if (!request.cookies.get("create_schedule_book_id")?.value) {
          return NextResponse.redirect(new URL("/create/book", request.url));
        }
        if (!request.cookies.get("create_schedule_exam_date")?.value) {
          return NextResponse.redirect(new URL("/create/date", request.url));
        }
        break;
    }
  }
  console.log("No middleware action needed, proceeding.");
  return NextResponse.next();
}

export const config = {
  matcher: [
    // 보호된 경로들만 정확히 매칭
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/create/:path*",
    // _next, api, static 파일들은 제외
    "/((?!api|_next|static|favicon.ico|.*\\.).*)",
    // auth/ 경로는 제외
    "/auth/:path*",
  ],
};
