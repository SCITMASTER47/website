"use client";

import { TodoProps } from "@/_types/schedule";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";

interface StatisticsChartsProps {
  todos: TodoProps[];
}

interface DailyProgress {
  date: string;
  completed: number;
  total: number;
}

interface SubjectStats {
  subject: string;
  completed: number;
  total: number;
  totalMinutes: number;
}

export default function StatisticsCharts({ todos }: StatisticsChartsProps) {
  // 일별 진행률 계산
  const dailyProgress = useMemo(() => {
    const progressMap = new Map<string, { completed: number; total: number }>();

    todos.forEach((todo) => {
      const existing = progressMap.get(todo.date) || { completed: 0, total: 0 };
      progressMap.set(todo.date, {
        completed: existing.completed + (todo.isDone ? 1 : 0),
        total: existing.total + 1,
      });
    });

    return Array.from(progressMap.entries())
      .map(([date, stats]) => ({
        date,
        completed: stats.completed,
        total: stats.total,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [todos]);

  // 과목별 통계 계산
  const subjectStats = useMemo(() => {
    const statsMap = new Map<
      string,
      { completed: number; total: number; totalMinutes: number }
    >();

    todos.forEach((todo) => {
      const subject = todo.chapter;
      const existing = statsMap.get(subject) || {
        completed: 0,
        total: 0,
        totalMinutes: 0,
      };
      statsMap.set(subject, {
        completed: existing.completed + (todo.isDone ? 1 : 0),
        total: existing.total + 1,
        totalMinutes: existing.totalMinutes + (todo.minute || 0),
      });
    });

    return Array.from(statsMap.entries())
      .map(([subject, stats]) => ({
        subject,
        completed: stats.completed,
        total: stats.total,
        totalMinutes: stats.totalMinutes,
      }))
      .sort((a, b) => b.total - a.total);
  }, [todos]);

  return (
    <div className="space-y-6">
      {/* 일별 진행률 그래프 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">일별 진행률</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyProgress.map((day, index) => {
            const progressPercent = (day.completed / day.total) * 100;
            return (
              <div key={day.date} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">
                    {new Date(day.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {day.completed}/{day.total}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(progressPercent)}%
                    </Badge>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 과목별 통계 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">과목별 통계</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectStats.map((subject, index) => {
            const progressPercent = (subject.completed / subject.total) * 100;
            const hours = Math.floor(subject.totalMinutes / 60);
            const minutes = subject.totalMinutes % 60;

            const colors = [
              "bg-blue-500",
              "bg-green-500",
              "bg-purple-500",
              "bg-orange-500",
              "bg-pink-500",
              "bg-indigo-500",
            ];

            return (
              <div key={subject.subject} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">
                      {subject.subject}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      총 학습시간: {hours > 0 ? `${hours}시간 ` : ""}
                      {minutes}분
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="mb-1">
                      {Math.round(progressPercent)}%
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {subject.completed}/{subject.total}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-full bg-secondary rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        colors[index % colors.length]
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 요약 통계 카드 */}
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">총 학습일</p>
              <p className="text-2xl font-bold text-primary">
                {dailyProgress.length}일
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              📅
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">총 학습시간</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.floor(
                  todos.reduce((sum, todo) => sum + todo.minute, 0) / 60
                )}
                시간
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              ⏰
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">학습 과목</p>
              <p className="text-2xl font-bold text-purple-600">
                {subjectStats.length}개
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              📚
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
