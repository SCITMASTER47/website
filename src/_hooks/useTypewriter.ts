import { useState, useEffect } from "react";

export const useTypewriter = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;

    // 상태 초기화
    setDisplayedText("");
    setIsComplete(false);

    let currentIndex = 0;
    let buffer = ""; // 버퍼 추가

    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        buffer += text[currentIndex]; // 버퍼에 문자 추가
        setDisplayedText(buffer); // 전체 버퍼를 설정
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
};
