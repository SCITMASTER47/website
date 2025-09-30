"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "로딩 중...",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="relative">
        <div
          className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-200`}
        >
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        </div>
      </div>
      {text && (
        <p
          className={`${textSizes[size]} text-gray-600 font-medium animate-pulse`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingDots({
  text = "로딩 중",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="text-gray-600 font-medium">{text}</span>
      <div className="flex gap-1">
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-2 h-2 bg-primary rounded-full animate-bounce"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  );
}

export function LoadingPulse({
  text = "로딩 중...",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className="flex gap-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        <div
          className="w-3 h-3 bg-primary/70 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 bg-primary/50 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
      {text && <p className="text-base text-gray-600 font-medium">{text}</p>}
    </div>
  );
}

export function LoadingCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

// 범용 로딩 컴포넌트 (기본값)
export default function Loading({
  type = "spinner",
  size = "md",
  text = "로딩 중...",
  className = "",
}: {
  type?: "spinner" | "dots" | "pulse" | "card";
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
}) {
  switch (type) {
    case "dots":
      return <LoadingDots text={text} className={className} />;
    case "pulse":
      return <LoadingPulse text={text} className={className} />;
    case "card":
      return <LoadingCard className={className} />;
    default:
      return <LoadingSpinner size={size} text={text} className={className} />;
  }
}
