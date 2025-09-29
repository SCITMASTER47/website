"use client";

import { TodoProps } from "@/_types/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";

interface ProgressChartProps {
  todos: TodoProps[];
}

export default function ProgressChart({ todos }: ProgressChartProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.isDone).length;
  const progressPercentage =
    totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const circumference = 2 * Math.PI * 40; // radius = 40 (더 작게)
  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  // 진행률에 따른 색상 결정
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "hsl(142, 76%, 36%)"; // 초록색
    if (percentage >= 60) return "hsl(45, 93%, 47%)"; // 노란색
    if (percentage >= 40) return "hsl(25, 95%, 53%)"; // 주황색
    return "hsl(0, 72%, 51%)"; // 빨간색
  };

  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="relative inline-block mb-4">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--border))"
              strokeWidth="8"
              fill="transparent"
              opacity="0.3"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getProgressColor(progressPercentage)}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-1">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-xs text-muted-foreground">완료율</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">완료</span>
            <Badge variant="default" className="text-xs">
              {completedTodos}/{totalTodos}
            </Badge>
          </div>

          {progressPercentage === 100 ? (
            <div className="flex items-center justify-center p-2 bg-green-50 rounded-lg">
              <span className="text-green-700 text-sm font-medium">
                🎉 모든 할일 완료!
              </span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              {totalTodos - completedTodos}개 할일이 남았습니다
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
