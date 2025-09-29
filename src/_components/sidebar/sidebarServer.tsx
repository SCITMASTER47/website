import { getAllSchedules } from "@/_action-server/schedule";
import { Suspense } from "react";
import SideBarComponent from "./sidebar";

export default async function SideBar() {
  return (
    <div className="flex py-2  flex-col gap-4 items-start justify-start  w-18 h-full border-r border-r-border/50 overflow-y-auto">
      <Suspense fallback={<SideBarLoading />}>
        <FetchSideBarItems />
      </Suspense>
    </div>
  );
}
async function FetchSideBarItems() {
  try {
    const schedules = await getAllSchedules();
    return <SideBarComponent schedules={schedules} />;
  } catch (error) {
    console.error("Error fetching sidebar items:", error);
    // 에러 발생 시 빈 스케줄로 렌더링
    return <SideBarComponent schedules={[]} />;
  }
}

async function SideBarLoading() {
  return (
    <div className="flex flex-col gap-4 items-start justify-start  w-18 h-full border-r border-r-border/50 "></div>
  );
}
