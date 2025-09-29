"use client";

import StudyTimer from "@/_components/StudyTimer";

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  subject?: string;
  notes?: string;
}

export default function TimerPage() {
  const handleSaveSession = async (session: StudySession) => {
    try {
      // 여기에 DB 저장 로직을 추가할 수 있습니다
      console.log("Study session saved:", session);

      // 추후 서버 액션이나 API 호출로 대체
      // await saveStudySession(session);

      // 성공 알림 (선택사항)
      // toast.success("학습 세션이 저장되었습니다!");
    } catch (error) {
      console.error("Failed to save study session:", error);
      // 에러 알림 (선택사항)
      // toast.error("세션 저장에 실패했습니다.");
    }
  };

  return (
    <div className="w-full">
      <StudyTimer
        userId="current-user-id" // 실제 유저 ID로 교체
        onSaveSession={handleSaveSession}
      />
    </div>
  );
}
