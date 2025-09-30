"use client";

import { useAIChatStore } from "@/_store/aiChat";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function AIChatting() {
  const { chats, isGenerating } = useAIChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      const el = scrollSectionRef.current;
      if (!el) return;
      const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10;
      setShowScrollIcon(!isBottom);
    };
    const el = scrollSectionRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [chats]);

  // 자동 스크롤
  useEffect(() => {
    if (scrollSectionRef.current) {
      scrollSectionRef.current.scrollTop =
        scrollSectionRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <section
      ref={scrollRef}
      className="relative flex grow flex-col h-full w-full. pr-2 overflow-y-hidden "
    >
      <div
        id="scrollSection"
        ref={scrollSectionRef}
        className="flex grow flex-col h-full w-full  overflow-y-auto space-y-4"
      >
        {chats.length === 0 && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <SmartToyIcon className="text-primary text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI 플래너와 대화하기
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              학습 계획 생성, 질문 답변, 진도 관리 등 무엇이든 도움을 받으세요
            </p>
          </div>
        )}

        {chats.map((chat) =>
          chat.role === "user" ? (
            // 사용자 메시지
            <div key={chat.uuid} className="flex justify-end mb-3">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm">
                  <div className="break-words whitespace-pre-wrap text-sm">
                    {typeof chat.message === "string"
                      ? chat.message
                      : String(chat.message ?? "")}
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <PersonIcon className="text-white text-sm" />
                </div>
              </div>
            </div>
          ) : (
            // AI 메시지
            <div key={chat.uuid} className="flex justify-start mb-3">
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="w-8 h-8 bg-white border-2 border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <SmartToyIcon className="text-primary text-sm" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary">
                      AI 플래너
                    </span>
                    <span className="text-xs text-gray-500">
                      {chat.timestamp.toLocaleTimeString("ko-KR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                    <div className="break-words whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                      <ReactMarkdown>
                        {typeof chat.message === "string"
                          ? chat.message
                          : String(chat.message ?? "")}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* 로딩 인디케이터 */}
        {isGenerating && (
          <div className="flex justify-start mb-3">
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 bg-white border-2 border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <SmartToyIcon className="text-primary text-sm" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">
                    AI 플래너
                  </span>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    응답 생성 중
                  </span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">
                      AI가 답변을 생성하고 있습니다...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showScrollIcon && (
        <button
          type="button"
          className="absolute bottom-4 right-4 bg-white border border-gray-200 rounded-full shadow-lg p-2 flex items-center justify-center hover:bg-gray-50 transition-all hover:scale-105"
          onClick={() => {
            if (scrollSectionRef.current) {
              scrollSectionRef.current.scrollTo({
                top: scrollSectionRef.current.scrollHeight,
                behavior: "smooth",
              });
            }
          }}
        >
          <ArrowDownwardIcon className="text-gray-600" />
        </button>
      )}
    </section>
  );
}
