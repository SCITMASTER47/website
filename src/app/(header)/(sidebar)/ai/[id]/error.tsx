"use client";

export default function OnError({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* 에러 아이콘 */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        {/* 펄스 애니메이션 */}
        <div className="absolute inset-0 w-20 h-20 bg-red-100 rounded-full animate-ping opacity-20"></div>
      </div>

      {/* 에러 메시지 */}
      <div className="text-center mb-8 max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          문제가 발생했습니다
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {message || "요청하신 AI 세션을 찾을 수 없거나 액세스할 수 없습니다."}
        </p>
      </div>

      {/* 제안사항 */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6 max-w-lg w-full">
        <h3 className="font-medium text-gray-900 mb-3">다음을 시도해보세요:</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            페이지를 새로고침해보세요
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            URL이 올바른지 확인해주세요
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            새로운 AI 세션을 시작해보세요
          </li>
        </ul>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          새로고침
        </button>
        <a
          href="/dashboard/create"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          새 세션 만들기
        </a>
        <a
          href="/dashboard"
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          대시보드로 돌아가기
        </a>
      </div>

      {/* 추가 도움말 */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          문제가 계속 발생하면{" "}
          <a href="/support" className="text-blue-600 hover:underline">
            고객 지원
          </a>
          에 문의하세요
        </p>
      </div>
    </div>
  );
}
