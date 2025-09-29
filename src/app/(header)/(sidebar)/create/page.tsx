// 동적 렌더링 강제 - 쿠키 접근이 필요한 페이지
export const dynamic = "force-dynamic";

export default function CreatePage() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          학습 일정 생성
        </h1>
        <p className="text-gray-600">새로운 학습 일정을 만들어 보세요.</p>
      </div>
    </div>
  );
}
