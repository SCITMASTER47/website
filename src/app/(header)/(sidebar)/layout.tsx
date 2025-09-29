import SideBar from "@/_components/sidebar/sidebarServer";

// cookies를 사용하는 서버 컴포넌트이므로 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function SideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-full overflow-hidden">
      <SideBar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
