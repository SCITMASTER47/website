"use client";
import { Schedule, ScheduleDetailResponse } from "@/_types/schedule";
import { SidebarItem } from "@/_types/sidebar";
import { create } from "zustand";

interface SidebarState {
  items: SidebarItem[];
  addSchedules: (schedules: ScheduleDetailResponse[]) => void;
  addItem: (item: SidebarItem) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
}
const sidebarDefaultItem = [
  {
    id: "add",
    displayName: "add",
    iconId: "add",
    link: "/create/certification",
    labelUrl: "/create",
  },
  {
    id: "users",
    displayName: "users",
    iconId: "users",
    link: "/users",
    labelUrl: "/users",
  },
  {
    id: "dashboard",
    displayName: "dashboard",
    iconId: "dashboard",
    link: "/dashboard",
    labelUrl: "/dashboard",
  },
];
const useSidebarStore = create<SidebarState>((set, get) => ({
  items: sidebarDefaultItem,
  addSchedules: (schedules: ScheduleDetailResponse[]) => {
    const scheduleItems: SidebarItem[] = schedules.map((schedule) => ({
      id: schedule.id,
      displayName: schedule.certificateInfo.title,
      iconId: "schedule",
      link: `/schedule/${schedule.id}`,
      labelUrl: `/schedule`,
    }));
    const existingItems = get().items.filter(
      (item) => item.iconId !== "schedule"
    );
    set({ items: [...existingItems, ...scheduleItems] });
  },
  addItem: (item: SidebarItem) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearItems: () => set({ items: [] }),
}));

export default useSidebarStore;
