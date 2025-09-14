const studyData = [
  {
    id: 1,
    date: "2025-09-01",
    dayOfWeek: "월요일",
    chapter: "1장: 인텔리제이로 스프링 부트 시작하기",
    pages: "1-9",
    studyGoal: "스프링 부트와 인텔리제이 환경 설정하기",
    keyTopics: ["스프링 부트 소개", "인텔리제이 설치"],
    estimatedTime: "60분",
    notes: "인텔리제이 설치 시 최신 버전을 사용하세요.",
    completed: false,
  },
  {
    id: 2,
    date: "2025-09-02",
    dayOfWeek: "화요일",
    chapter: "2장: 스프링 부트 프로젝트 생성",
    pages: "10-25",
    studyGoal: "스프링 이니셜라이저로 프로젝트 만들기",
    keyTopics: ["Spring Initializr", "프로젝트 구조 이해", "build.gradle 파일"],
    estimatedTime: "90분",
    notes: "Lombok 라이브러리를 추가하면 코드가 간결해집니다.",
    completed: false,
  },
];

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 각 객체별로 3글자씩 전송

      const text = JSON.stringify(studyData);
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        controller.enqueue(encoder.encode(`data: ${char}\n\n`));
        await new Promise((res) => setTimeout(res, 10));
      }

      controller.close();
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
