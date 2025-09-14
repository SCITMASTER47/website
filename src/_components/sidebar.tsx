"use client";

import useSidebarStore from "@/_store/sidebar";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { SidebarItem } from "@/_types/sidebar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SideBar() {
  const currentPath = usePathname();

  const iconMap = {
    add: <AddIcon className="text-primary" />,
    dashboard: <CalendarMonthIcon className="text-primary" />,
  };
  const { items } = useSidebarStore();
  return (
    <div className="flex flex-col py-4 gap-4 items-start justify-start  w-18 h-full border-r border-r-border/50 ">
      {items.map((item) => (
        <div
          className={` px-4 ${
            currentPath.includes(item.labelUrl)
              ? " border-primary"
              : "border-transparent"
          } border-l-4`}
          key={item.id}
        >
          <IconButton
            key={item.id}
            item={item}
            icon={iconMap[item.iconId as keyof typeof iconMap]}
          />
        </div>
      ))}
    </div>
  );
}

function IconButton({
  item,
  icon,
}: {
  item: SidebarItem;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={item.link}
      className={`p-2 w-10 h-10 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:rotate-360 active:scale-90 transition-all duration-500 border-primary`}
    >
      {icon}
    </Link>
  );
}
