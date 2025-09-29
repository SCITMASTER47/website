"use client";

import { useAIChatStore } from "@/_store/aiChat";
import SendIcon from "@mui/icons-material/Send";
import { useRef, useEffect } from "react";

export default function AIPromptForm() {
  const {
    prompt,
    isGenerating,
    setPrompt,
    generateAIResponse: handleSubmit,
  } = useAIChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 텍스트 변경시 높이 자동 조정
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        handleSubmit();
      }
    }
  };

  return (
    <div className="px-3 py-2 flex flex-col gap-4 w-full bg-card rounded-3xl border-2 border-border items-end">
      <textarea
        ref={textareaRef}
        id="aiPrompt"
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-2 rounded-lg text-base border-none focus:border-none focus:ring-0 focus:outline-none resize-none overflow-hidden min-h-[40px] max-h-[200px]"
        placeholder="AI에게 질문 또는 요청을 입력하세요... "
        style={{ height: "auto" }}
      />
      <div className="flex items-end justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!prompt || isGenerating}
          className={`${
            prompt ? "bg-black hover:scale-95 active:scale-90" : "bg-gray-300 "
          } p-1 h-6 w-6  text-white rounded-full   flex items-center justify-center  transition-all`}
          aria-label="전송"
        >
          <SendIcon fontSize="inherit" />
        </button>
      </div>
    </div>
  );
}
