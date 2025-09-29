"use client";
import { useTypewriter } from "@/_hooks/useTypewriter";
import { useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const TypewriterText = ({
  text,
  speed = 50,
  className = "",
  onComplete,
}: TypewriterTextProps) => {
  const { displayedText, isComplete } = useTypewriter(text, speed);

  useEffect(() => {
    if (isComplete && onComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-primary">|</span>}
    </span>
  );
};
