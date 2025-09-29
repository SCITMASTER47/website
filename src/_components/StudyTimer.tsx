"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Button } from "@/_ui/button";
import { Badge } from "@/_ui/badge";
import { getUserStudyStats, updateStudyStats } from "@/_action-server/timer";
import {
  PlayIcon,
  PauseIcon,
  SquareIcon,
  ClockIcon,
  TrophyIcon,
  CalendarIcon,
  BookOpenIcon,
  TimerIcon,
} from "lucide-react";

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // milliseconds
  subject?: string;
  notes?: string;
}

interface StudyTimerProps {
  userId?: string;
  onSaveSession?: (session: StudySession) => void;
}

export default function StudyTimer({ userId, onSaveSession }: StudyTimerProps) {
  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0); // milliseconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Study stats
  const [totalStudyTime, setTotalStudyTime] = useState(0); // milliseconds from DB
  const [todayStudyTime, setTodayStudyTime] = useState(0); // milliseconds
  const [weeklyStudyTime, setWeeklyStudyTime] = useState(0); // milliseconds
  const [currentStreak, setCurrentStreak] = useState(0); // days

  // Current time display
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadStudyStats = useCallback(async () => {
    if (userId) {
      try {
        const result = await getUserStudyStats(userId);
        if (result.success && result.stats) {
          setTotalStudyTime(result.stats.totalStudyTime);
          setTodayStudyTime(result.stats.todayStudyTime);
          setWeeklyStudyTime(result.stats.weeklyStudyTime);
          setCurrentStreak(result.stats.currentStreak);
        }
      } catch (error) {
        console.error("Failed to load study stats:", error);
      }
    }

    // 임시로 localStorage에서도 로드 (fallback)
    const stats = localStorage.getItem("studyStats");
    if (stats) {
      const parsedStats = JSON.parse(stats);
      setTotalStudyTime((prev) => prev || parsedStats.totalStudyTime || 0);
      setTodayStudyTime((prev) => prev || parsedStats.todayStudyTime || 0);
      setWeeklyStudyTime((prev) => prev || parsedStats.weeklyStudyTime || 0);
      setCurrentStreak((prev) => prev || parsedStats.currentStreak || 0);
    }
  }, [userId]);

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());

    // Clock update
    clockIntervalRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load user's study statistics
    loadStudyStats();

    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, [loadStudyStats]);

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        if (startTime) {
          setElapsedTime(now.getTime() - startTime.getTime());
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime]);

  const saveStudyStats = (additionalTime: number) => {
    const newTotalTime = totalStudyTime + additionalTime;
    const newTodayTime = todayStudyTime + additionalTime;
    const newWeeklyTime = weeklyStudyTime + additionalTime;

    const stats = {
      totalStudyTime: newTotalTime,
      todayStudyTime: newTodayTime,
      weeklyStudyTime: newWeeklyTime,
      currentStreak,
      lastStudyDate: new Date().toISOString(),
    };

    localStorage.setItem("studyStats", JSON.stringify(stats));

    setTotalStudyTime(newTotalTime);
    setTodayStudyTime(newTodayTime);
    setWeeklyStudyTime(newWeeklyTime);
  };

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setSessionId(`session_${now.getTime()}`);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    if (startTime && elapsedTime > 0) {
      // Save session
      const session: StudySession = {
        id: sessionId || `session_${Date.now()}`,
        startTime,
        endTime: new Date(),
        duration: elapsedTime,
      };

      // Save to stats
      saveStudyStats(elapsedTime);

      // Call parent callback if provided
      if (onSaveSession) {
        onSaveSession(session);
      }
    }

    // Reset timer
    setIsRunning(false);
    setElapsedTime(0);
    setStartTime(null);
    setSessionId(null);
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTimeToHours = (milliseconds: number) => {
    const hours = milliseconds / (1000 * 60 * 60);
    return `${hours.toFixed(1)}h`;
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-8">
              <div className="text-center">로딩 중...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 현재 시간 표시 */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-primary" />
              <CardTitle>현재 시간</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground mb-2">
                {currentTime.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "long",
                  timeZone: "Asia/Seoul",
                })}
              </div>
              <div className="text-4xl font-mono font-bold text-primary">
                {currentTime.toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: "Asia/Seoul",
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 메인 타이머 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TimerIcon className="h-5 w-5 text-primary" />
                <CardTitle>학습 타이머</CardTitle>
              </div>
              <Badge
                variant={isRunning ? "default" : "secondary"}
                className="px-3 py-1"
              >
                {isRunning ? "진행 중" : "대기 중"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-6">
              {/* 타이머 디스플레이 */}
              <div className="p-8 bg-muted/30 rounded-2xl">
                <div className="text-6xl font-mono font-bold text-primary mb-2">
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRunning ? "학습 진행 중..." : "타이머를 시작하세요"}
                </div>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center justify-center gap-4">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    <PlayIcon className="h-5 w-5 mr-2" />
                    시작
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="secondary"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    <PauseIcon className="h-5 w-5 mr-2" />
                    일시정지
                  </Button>
                )}

                <Button
                  onClick={handleStop}
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                  disabled={!startTime}
                >
                  <SquareIcon className="h-5 w-5 mr-2" />
                  종료
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 학습 통계 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    오늘 학습시간
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {formatTimeToHours(
                      todayStudyTime + (isRunning ? elapsedTime : 0)
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    이번 주
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatTimeToHours(
                      weeklyStudyTime + (isRunning ? elapsedTime : 0)
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <BookOpenIcon className="h-4 w-4 text-blue-600" />
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
                  <p className="text-2xl font-bold text-green-600">
                    {formatTimeToHours(
                      totalStudyTime + (isRunning ? elapsedTime : 0)
                    )}
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <ClockIcon className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    연속 학습
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {currentStreak}일
                  </p>
                </div>
                <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <TrophyIcon className="h-4 w-4 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 오늘의 목표 달성률 */}
        <Card>
          <CardHeader>
            <CardTitle>오늘의 목표</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>목표: 4시간</span>
                <span>
                  {formatTimeToHours(
                    todayStudyTime + (isRunning ? elapsedTime : 0)
                  )}{" "}
                  / 4.0h
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      ((todayStudyTime + (isRunning ? elapsedTime : 0)) /
                        (4 * 60 * 60 * 1000)) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                {Math.round(
                  ((todayStudyTime + (isRunning ? elapsedTime : 0)) /
                    (4 * 60 * 60 * 1000)) *
                    100
                )}
                % 달성
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
