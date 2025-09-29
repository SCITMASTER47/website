"use client";
import { Dispatch, SetStateAction } from "react";

import AIChatting from "./ai_chatting";
import AIPromptForm from "./ai-prompt-form";

interface AIChatProps {
  chatWidth: number;
  onMouseDown: () => void;
  isResizingBarVisible: boolean;
  setIsResizingBarVisible: Dispatch<SetStateAction<boolean>>;
}

export default function AIChat({
  chatWidth,
  onMouseDown,
  isResizingBarVisible,
  setIsResizingBarVisible,
}: AIChatProps) {
  // 이벤트 등록/해제

  return (
    <section
      id="chatSection"
      className="flex relative"
      style={{
        width: chatWidth,
      }}
    >
      <div className="flex flex-col h-full w-full">
        <AIChatting />
        <section className="p-2 flex w-full ">
          <AIPromptForm />
        </section>
      </div>
      <div
        id="resizingBar"
        className={` w-2 cursor-col-resize absolute right-0 h-full z-10 `}
        onMouseDown={onMouseDown}
        onMouseEnter={() => setIsResizingBarVisible(true)}
        onMouseLeave={() => setIsResizingBarVisible(false)}
      >
        <div
          className={`absolute right-0 w-0.5 h-full transition-all duration-300`}
          style={{
            background: isResizingBarVisible
              ? "linear-gradient(to top, transparent 0%, #9ca3af 50%, transparent 100%)"
              : "transparent",
          }}
        >
          {/* 중앙 위치 */}
          <div
            className={`${
              isResizingBarVisible ? "bg-gray-400" : "bg-transparent"
            } absolute h-8 w-2 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300`}
          />
        </div>
      </div>
    </section>
  );
}
