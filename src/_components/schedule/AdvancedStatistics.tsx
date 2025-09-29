"use client";

import { TodoProps } from "@/_types/schedule";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import {
  CalendarDaysIcon,
  ClockIcon,
  BookOpenIcon,
  TrendingUpIcon,
  CheckCircleIcon,
  TargetIcon,
  BarChartIcon,
} from "lucide-react";

interface AdvancedStatisticsProps {
  todos: TodoProps[];
}

export default function AdvancedStatistics({ todos }: AdvancedStatisticsProps) {
  // 일별 진행률 계산
  const dailyProgress = useMemo(() => {
    const progressMap = new Map<
      string,
      { completed: number; total: number; totalMinutes: number }
    >();

    todos.forEach((todo) => {
      const existing = progressMap.get(todo.date) || {
        completed: 0,
        total: 0,
        totalMinutes: 0,
      };
      progressMap.set(todo.date, {
        completed: existing.completed + (todo.isDone ? 1 : 0),
        total: existing.total + 1,
        totalMinutes: existing.totalMinutes + (todo.minute || 0),
      });
    });

    return Array.from(progressMap.entries())
      .map(([date, stats]) => ({
        date,
        completed: stats.completed,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
        totalMinutes: stats.totalMinutes,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // 최근 7일만 표시
  }, [todos]);

  // 과목별 통계 계산
  const subjectStats = useMemo(() => {
    const statsMap = new Map<
      string,
      { completed: number; total: number; totalMinutes: number }
    >();

    todos.forEach((todo) => {
      const subject = todo.chapter || "기타";
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
        percentage: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
        totalMinutes: stats.totalMinutes,
        avgMinutesPerTodo:
          stats.total > 0 ? Math.round(stats.totalMinutes / stats.total) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [todos]);

  // 전체 통계
  const overallStats = useMemo(() => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.isDone).length;
    const totalMinutes = todos.reduce(
      (sum, todo) => sum + (todo.minute || 0),
      0
    );
    const completedMinutes = todos
      .filter((todo) => todo.isDone)
      .reduce((sum, todo) => sum + (todo.minute || 0), 0);
    const avgMinutesPerTodo =
      totalTodos > 0 ? Math.round(totalMinutes / totalTodos) : 0;

    return {
      totalTodos,
      completedTodos,
      remainingTodos: totalTodos - completedTodos,
      completionRate: totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      completedHours: Math.round((completedMinutes / 60) * 10) / 10,
      remainingHours:
        Math.round(((totalMinutes - completedMinutes) / 60) * 10) / 10,
      avgMinutesPerTodo,
    };
  }, [todos]);

  return (
    <div className="space-y-6">
      {/* 전체 통계 요약 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  완료율
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(overallStats.completionRate)}%
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUpIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  총 학습시간
                </p>
                <p className="text-2xl font-bold">{overallStats.totalHours}h</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <ClockIcon className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 일별 진행률 차트 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">최근 7일 진행률</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dailyProgress.map((day) => (
              <div key={day.date} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {new Date(day.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                      weekday: "short",
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {day.completed}/{day.total}
                    </Badge>
                    <span className="text-muted-foreground">
                      {Math.round(day.percentage)}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${day.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-end text-xs text-muted-foreground">
                  <span>{day.totalMinutes}분</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 과목별 통계 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">과목별 진행률</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {subjectStats.map((subject, index) => (
              <div key={subject.subject} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: `hsl(${
                          (index * 137.5) % 360
                        }, 70%, 50%)`,
                      }}
                    />
                    <span className="font-medium text-sm">
                      {subject.subject}
                    </span>
                  </div>
                  <Badge
                    variant={
                      subject.percentage === 100 ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {Math.round(subject.percentage)}%
                  </Badge>
                </div>

                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${subject.percentage}%`,
                      backgroundColor: `hsl(${
                        (index * 137.5) % 360
                      }, 70%, 50%)`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                  <div className="text-center">
                    <div className="font-medium text-foreground">
                      {subject.completed}
                    </div>
                    <div>완료</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">
                      {subject.total - subject.completed}
                    </div>
                    <div>남은 작업</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-foreground">
                      {subject.totalMinutes} min
                    </div>
                    <div>총 시간</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 학습 패턴 분석 */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChartIcon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">학습 패턴 분석</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TargetIcon className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">평균 학습시간</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {overallStats.avgMinutesPerTodo}분
              </div>
              <p className="text-xs text-muted-foreground">할일당 평균</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">남은 학습시간</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {overallStats.remainingHours}h
              </div>
              <p className="text-xs text-muted-foreground">완료까지 예상</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">진행 상황</span>
            </div>
            <div className="text-sm text-muted-foreground">
              현재까지{" "}
              <strong className="text-foreground">
                {overallStats.completedTodos}개
              </strong>
              의 할일을 완료했으며,
              <strong className="text-foreground">
                {" "}
                {overallStats.completedHours}시간
              </strong>{" "}
              학습했습니다. 목표 달성까지{" "}
              <strong className="text-foreground">
                {overallStats.remainingTodos}개
              </strong>
              의 할일이 남았습니다.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
