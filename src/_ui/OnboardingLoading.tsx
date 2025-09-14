import { Loader2, Brain } from "lucide-react";
import { Card, CardContent } from "./card";

export default function OnboardingLoading() {
  return (
    <div className=" flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            AI가 맞춤형 학습 계획을 생성하고 있습니다
          </h3>
          <p className="text-gray-600 mb-4">잠시만 기다려주세요...</p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
