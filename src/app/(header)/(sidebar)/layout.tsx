import SideBar from "@/_components/sidebar";

export default function SideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  w-full h-full">
      <SideBar />
      <div className="flex-1 p-4">{children}</div>
    </div>
  );
}
