"use client";

import AIChat from "@/_components/AI/chat-layout";
import ScheduleLayout from "@/_components/AI/schedule-layout";
import { useAIChatStore } from "@/_store/aiChat";
import { Chat, Version } from "@/_types/chat";
import { useState, useRef, useEffect } from "react";

//AI id param 받기
export interface AIPageProps {
  sessionId: string;
  chatHistory: Chat<string>[];
  versions: Version[];
}
export default function AIPage({
  sessionId,
  chatHistory,
  versions,
}: AIPageProps) {
  const [chatWidth, setChatWidth] = useState(320);
  const [isResizingBarVisible, setIsResizingBarVisible] = useState(false);
  const isResizing = useRef(false);
  const { onAIPageLoad } = useAIChatStore();
  const handleMouseDown = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
  };

  useEffect(() => {
    onAIPageLoad(chatHistory, versions, sessionId);
  }, [chatHistory, versions, sessionId, onAIPageLoad]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing.current) {
        setChatWidth(e.clientX);
      }
    };
    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "default";
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-row relative  overflow-hidden">
      <AIChat
        chatWidth={chatWidth}
        onMouseDown={handleMouseDown}
        isResizingBarVisible={isResizingBarVisible}
        setIsResizingBarVisible={setIsResizingBarVisible}
      />
      <section className="flex grow">
        <ScheduleLayout />
      </section>
    </div>
  );
}
