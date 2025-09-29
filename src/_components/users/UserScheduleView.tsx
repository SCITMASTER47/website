"use client";

import { User } from "@/_types/user";
import { Schedule, ScheduleDetailResponse, TodoProps } from "@/_types/schedule";
import { useState, useEffect } from "react";
import useUserStore from "@/_store/user";
import { getTodosByScheduleId } from "@/_action-server/schedule";
import Todo from "@/_components/todo";
import { Card } from "@/_ui/card";
import { Badge } from "@/_ui/badge";
import { Button } from "@/_ui/button";
import {
  User as UserIcon,
  BookOpen,
  Calendar,
  Clock,
  X,
  Award,
  TrendingUp,
  CheckCircle,
  Target,
} from "lucide-react";
import ScheduleAvgDashboard from "@/_ui/scheduleAvgDashboard";
import ScheduleDetailView from "@/_ui/scheduleDetail";
import TodoDetailView from "../schedule/TodoDetailView";

interface UserScheduleViewProps {
  schedules: ScheduleDetailResponse[];

  isLoading?: boolean;
}

export default function UserScheduleView({
  schedules,
  isLoading,
}: UserScheduleViewProps) {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ScheduleDetailResponse | null>(null);
  const [todos, setTodos] = useState<TodoProps[]>([]);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const { selectedUser } = useUserStore();

  const handleScheduleSelect = async (schedule: ScheduleDetailResponse) => {
    setSelectedSchedule(schedule);
    setLoadingTodos(true);
    setShowTodoModal(true);

    try {
      if (selectedUser?.id) {
        const todoList = await getTodosByScheduleId(
          schedule.id,
          selectedUser.id
        );
        if (!todoList) {
          setTodos([]);
        } else {
          setTodos(todoList);
        }
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      setTodos([]);
    } finally {
      setLoadingTodos(false);
    }
  };

  const handleCloseTodoModal = () => {
    setShowTodoModal(false);
    setSelectedSchedule(null);
    setTodos([]);
  };

  if (isLoading) {
    return <UserScheduleViewSkeleton />;
  }

  return (
    <div className="flex flex-col space-y-6 h-full">
      {/* 사용자 프로필 헤더 */}
      <div className="flex-shrink-0">
        <UserProfileHeader user={selectedUser} />
      </div>

      {/* 스케줄 목록 */}
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookOpen className="text-primary w-5 h-5" />
            학습 스케줄 ({schedules.length})
          </h3>
        </div>

        {schedules.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyScheduleState />
          </div>
        ) : (
          <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
            {schedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                isSelected={selectedSchedule?.id === schedule.id}
                onSelect={() => handleScheduleSelect(schedule)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Todo 모달 */}
      {showTodoModal && (
        <TodoModal
          schedule={selectedSchedule}
          todos={todos}
          isLoading={loadingTodos}
          onClose={handleCloseTodoModal}
        />
      )}
    </div>
  );
}

interface UserProfileHeaderProps {
  user: User | null;
}

function UserProfileHeader({ user }: UserProfileHeaderProps) {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary/5 to-blue-50 border-primary/10">
      <div className="flex items-start gap-6">
        {/* 아바타 */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shadow-lg">
            <UserIcon className="text-primary w-8 h-8" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.id || "Guest"}
            </h2>
            <Badge variant="secondary" className="text-xs">
              활성 사용자
            </Badge>
          </div>
          <p className="text-gray-600 mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            {user?.email || "No email provided"}
          </p>

          {/* 간단한 정보만 표시 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <StatItem
              icon={<BookOpen className="text-blue-500 w-4 h-4" />}
              label="사용자 ID"
              value={user?.id || "N/A"}
              color="bg-blue-50 border-blue-200"
            />
            <StatItem
              icon={<UserIcon className="text-green-500 w-4 h-4" />}
              label="계정 상태"
              value="활성"
              color="bg-green-50 border-green-200"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: string;
}

function StatItem({ icon, label, value, color = "bg-white" }: StatItemProps) {
  return (
    <Card className={`p-3 ${color} border`}>
      <div className="flex items-center gap-2">
        {icon}
        <div className="min-w-0 flex-1">
          <div className="text-xs text-gray-500 font-medium">{label}</div>
          <div className="font-semibold text-gray-900 text-sm">{value}</div>
        </div>
      </div>
    </Card>
  );
}

interface ScheduleCardProps {
  schedule: ScheduleDetailResponse;
  isSelected: boolean;
  onSelect: () => void;
}

function ScheduleCard({ schedule, isSelected, onSelect }: ScheduleCardProps) {
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const now = new Date();

  // 남은 일수 계산
  const remainingDays = Math.max(
    0,
    Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // 자격증 레벨 추출
  const getCertificationLevel = (title: string) => {
    const levelMatch = title.match(/(\d급|N\d|Level\s?\d)/i);
    return levelMatch ? levelMatch[0] : null;
  };

  const level = getCertificationLevel(schedule.certificateInfo?.title || "");

  return (
    <Card
      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-gray-200 hover:border-primary/50"
      }`}
      onClick={onSelect}
    >
      <div className="space-y-4">
        {/* 헤더: 제목과 자격증 레벨 */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-bold text-lg text-gray-900">
                {schedule.certificateInfo.title}
              </h4>
              {level && (
                <Badge variant="secondary" className="text-xs font-semibold">
                  <Award className="w-3 h-3 mr-1" />
                  {level}
                </Badge>
              )}
            </div>

            {/* 자격증 정보 */}
            <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {schedule.certificateInfo.title}
            </p>

            {/* 교재 정보 */}
            {schedule.readBookDTO && (
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                📚 {schedule.readBookDTO.title} (
                {schedule.readBookDTO.companyName})
              </p>
            )}
          </div>

          {/* 스케줄 ID */}
          <div className="text-right">
            <div className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
              ID: {schedule.id}
            </div>
          </div>
        </div>

        {/* 기간 정보 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-lg font-bold text-blue-600">
              {remainingDays}
            </div>
            <div className="text-xs text-blue-500">남은 일수</div>
          </div>
        </div>

        {/* 날짜 정보 */}
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            시작: {startDate.toLocaleDateString("ko-KR")}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            종료: {endDate.toLocaleDateString("ko-KR")}
          </div>
        </div>

        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
          <span>
            생성: {new Date(schedule.createdAt).toLocaleDateString("ko-KR")}
          </span>
          <span>버전: {schedule.versionId}</span>
        </div>
      </div>
    </Card>
  );
}

interface ScheduleDetailPanelProps {
  schedule: Schedule;
  onClose: () => void;
}

function ScheduleDetailPanel({ schedule, onClose }: ScheduleDetailPanelProps) {
  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);
  const now = new Date();

  // 진행률 계산
  const totalDays = Math.max(
    1,
    Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const passedDays = Math.max(
    0,
    Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const progress = Math.min(100, Math.max(0, (passedDays / totalDays) * 100));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {schedule.title || schedule.planName}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="font-medium text-gray-700">시작일</label>
                <p className="text-gray-600">
                  {startDate.toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div>
                <label className="font-medium text-gray-700">종료일</label>
                <p className="text-gray-600">
                  {endDate.toLocaleDateString("ko-KR")}
                </p>
              </div>
            </div>

            <div>
              <label className="font-medium text-gray-700">진행률</label>
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>진행상황</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-medium text-gray-700">스케줄 ID</label>
              <p className="text-gray-600 text-xs font-mono">{schedule.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyScheduleState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <BookOpen className="text-4xl mb-2 opacity-50" />
      <p className="text-sm">아직 생성된 스케줄이 없습니다</p>
    </div>
  );
}

function UserScheduleViewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* 프로필 스켈레톤 */}
      <div className="p-6 bg-gray-100 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-48" />
            <div className="h-4 bg-gray-200 rounded w-64" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 스케줄 스켈레톤 */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <div className="h-5 bg-gray-300 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-3" />
            <div className="flex justify-between">
              <div className="h-3 bg-gray-200 rounded w-32" />
              <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TodoModalProps {
  schedule: ScheduleDetailResponse | null;
  todos: TodoProps[];
  isLoading: boolean;
  onClose: () => void;
}

function TodoModal({ schedule, todos, isLoading, onClose }: TodoModalProps) {
  // 모달이 열렸을 때 배경 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!schedule) return null;

  const completedTodos = todos.filter((todo) => todo.isDone).length;
  const progressPercentage =
    todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 통계 대시보드 */}
        <ScheduleAvgDashboard todos={todos} />

        {/* 내용 */}
        <section className="flex w-full h-full overflow-hidden">
          <div className="flex-2 px-4 py-2 overflow-auto">
            <ScheduleDetailView schedule={schedule} />
          </div>
          <div className="flex-5 overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-lg text-gray-600">
                  TODO 목록을 불러오는 중...
                </p>
              </div>
            ) : todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <BookOpen className="text-6xl mb-4 opacity-50" />
                <p className="text-xl font-semibold mb-2">
                  등록된 TODO가 없습니다
                </p>
                <p className="text-sm text-gray-400">
                  이 스케줄에는 아직 할 일이 없습니다.
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                {/* 서브 헤더 */}
                <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />할 일 목록
                      ({todos.length}개)
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="font-semibold">
                        {progressPercentage}% 완료
                      </span>
                    </div>
                  </div>
                </div>

                {/* 스크롤 가능한 컨텐츠 영역 */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {todos.map((todo) => (
                      <Todo
                        key={todo.id}
                        {...todo}
                        readOnly={true}
                        editable={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 푸터 */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {todos.length > 0 ? (
                <div className="flex items-center gap-4">
                  <span>
                    총 {todos.length}개 할일 중 {completedTodos}개 완료
                  </span>
                  <span>•</span>
                  <span>
                    총 학습시간:{" "}
                    {todos.reduce((total, todo) => total + todo.minute, 0)}분
                  </span>
                </div>
              ) : (
                <span>등록된 할일이 없습니다</span>
              )}
            </div>
            <Button variant="outline" onClick={onClose} className="px-6 py-2">
              닫기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
