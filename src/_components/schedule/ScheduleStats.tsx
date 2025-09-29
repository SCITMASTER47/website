"use client";

import { TodoProps } from "@/_types/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  TrendingUpIcon,
} from "lucide-react";

interface ScheduleStatsProps {
  todos: TodoProps[];
}

export default function ScheduleStats({ todos }: ScheduleStatsProps) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter((todo) => todo.isDone).length;
  const inProgressTodos = totalTodos - completedTodos;
  const totalMinutes = todos.reduce((sum, todo) => sum + todo.minute, 0);
  const completedMinutes = todos
    .filter((todo) => todo.isDone)
    .reduce((sum, todo) => sum + todo.minute, 0);

  const progressPercentage =
    totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  // 과목별 통계
  const subjectStats = todos.reduce((acc, todo) => {
    const subjectName = todo.subject.name;
    if (!acc[subjectName]) {
      acc[subjectName] = { total: 0, completed: 0 };
    }
    acc[subjectName].total++;
    if (todo.isDone) {
      acc[subjectName].completed++;
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // 시간을 시간:분 형식으로 변환
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  return (
    <div className="space-y-6">
      {/* 전체 진행률 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUpIcon className="w-5 h-5 text-primary" />
            전체 진행률
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <svg
                className="w-32 h-32 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-gray-200"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-primary"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercentage * 1.005} 100.5`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-900">
                  {progressPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* 통계 카드들 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {totalTodos}
              </div>
              <div className="text-xs text-blue-500">전체 할일</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {completedTodos}
              </div>
              <div className="text-xs text-green-500">완료</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {inProgressTodos}
              </div>
              <div className="text-xs text-orange-500">진행중</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {formatMinutes(totalMinutes)}
              </div>
              <div className="text-xs text-purple-500">총 학습시간</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 학습 시간 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-green-600" />
            학습 시간 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">완료된 학습시간</span>
              <span className="font-semibold text-green-600">
                {formatMinutes(completedMinutes)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">남은 학습시간</span>
              <span className="font-semibold text-orange-600">
                {formatMinutes(totalMinutes - completedMinutes)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalMinutes > 0
                      ? (completedMinutes / totalMinutes) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 과목별 진행률 */}
      {Object.keys(subjectStats).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-blue-600" />
              과목별 진행률
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(subjectStats).map(([subject, stats]) => {
                const subjectProgress = Math.round(
                  (stats.completed / stats.total) * 100
                );
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {subject}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {stats.completed}/{stats.total}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {subjectProgress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${subjectProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
