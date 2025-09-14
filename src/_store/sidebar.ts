"use client";
import { SidebarItem } from "@/_types/sidebar";
import { create } from "zustand";

interface SidebarState {
  items: SidebarItem[];
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
    id: "dashboard",
    displayName: "dashboard",
    iconId: "dashboard",
    link: "/dashboard",
    labelUrl: "/dashboard",
  },
  {
    id: "schedule",
    displayName: "schedule",
    iconId: "schedule",
    link: "/schedule/test",
    labelUrl: "/schedule",
  },
];
const useSidebarStore = create<SidebarState>((set, get) => ({
  items: sidebarDefaultItem,
  addItem: (item: SidebarItem) =>
    set((state) => ({ items: [...state.items, item] })),
  removeItem: (id: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearItems: () => set({ items: [] }),
}));

export default useSidebarStore;
