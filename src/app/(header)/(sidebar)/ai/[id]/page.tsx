import { getChatHistory, getVersions } from "@/_action-server/ai";
import AIPage from "@/_pages/ai";
import { Chat, Version } from "@/_types/chat";

import { Suspense } from "react";

// 동적 렌더링 강제 - 쿠키 접근이 필요한 페이지
export const dynamic = "force-dynamic";

// AI 페이지 로딩 컴포넌트
function AILoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* 로딩 아이콘과 애니메이션 */}
      <div className="relative mb-8">
        {/* 메인 로딩 원 */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* 내부 펄스 */}
        <div className="absolute inset-2 w-8 h-8 bg-blue-100 rounded-full animate-pulse"></div>

        {/* 외부 링 애니메이션 */}
        <div className="absolute -inset-2 w-20 h-20 border border-blue-100 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* 로딩 메시지 */}
      <div className="text-center mb-6 max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          AI 세션을 불러오는 중...
        </h2>
        <p className="text-gray-600 text-sm">
          채팅 기록과 학습 계획을 준비하고 있습니다
        </p>
      </div>

      {/* 로딩 단계 표시 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 max-w-lg w-full">
        <div className="space-y-3">
          <LoadingStep text="채팅 기록 로드 중" isActive={true} />
          <LoadingStep text="버전 정보 확인 중" isActive={false} />
          <LoadingStep text="학습 계획 준비 중" isActive={false} />
        </div>
      </div>

      {/* 로딩 바 */}
      <div className="w-full max-w-xs">
        <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* 힌트 텍스트 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          💡 잠시만 기다려주세요. 곧 AI와의 대화를 시작할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

// 개별 로딩 단계 컴포넌트
function LoadingStep({ text, isActive }: { text: string; isActive: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {isActive ? (
        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
      ) : (
        <div className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></div>
      )}
      <span
        className={`text-sm ${
          isActive ? "text-gray-900 font-medium" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  );
}
//dynamic route 로 받기
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ version?: string }>;
}) {
  const id = (await params).id;
  const searchParam = await searchParams;
  const version = searchParam.version;

  if (!id) {
    throw new Error("AI ID가 없습니다.");
  }

  return (
    <div className="grow w-full h-full  flex flex-col">
      <Suspense fallback={<AILoadingState />}>
        <FetchChat id={id} version={version} />
      </Suspense>
    </div>
  );
}

async function FetchChat({ id }: { id: string; version: string | undefined }) {
  let chatHistory: Chat<string>[];
  let versions: Version[];

  //TODO:
  //*1 id로 chathistory 호출
  //*2 id로 versions 정보 호출
  //*3 versions 가 있다면 최신버전 JSON 호출
  //*4 error -> create 할 수 있도록 유도
  try {
    // 1,2,3 번 API 비동기 호출
    chatHistory = await getChatHistory(id);
    versions = await getVersions(id);
  } catch (e) {
    throw e;
  }
  return (
    <AIPage sessionId={id} chatHistory={chatHistory} versions={versions} />
  );
}
