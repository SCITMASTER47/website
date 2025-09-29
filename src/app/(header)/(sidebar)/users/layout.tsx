import PeopleIcon from "@mui/icons-material/People";
import { Suspense } from "react";
export default function UserLayout({
  children,
  detail,
}: {
  children: React.ReactNode;
  detail: React.ReactNode;
}) {
  return (
    <div className="h-full w-full flex">
      <div className="w-1/2 h-full border-r border-border/50 p-6 flex flex-col overflow-y-hidden ">
        {/* 헤더 */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <PeopleIcon className="text-primary" />
            사용자 관리
          </h1>
          <p className="text-gray-600">사용자를 검색하고 친구를 추가해보세요</p>
        </div>
        <div className="h-full w-full flex overflow-y-auto">{children}</div>
      </div>

      <div className="w-1/2 p-6">
        <Suspense fallback={<div>Loading...</div>}>{detail}</Suspense>
      </div>
    </div>
  );
}
