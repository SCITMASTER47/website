"use client";

import { useState } from "react";
import { TodoProps } from "@/_types/schedule";
import { updateTodoStatus } from "@/_action-server/schedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/_ui/card";
import { Button } from "@/_ui/button";
import { Input } from "@/_ui/input";
import { Checkbox } from "@/_ui/checkbox";
import { Badge } from "@/_ui/badge";
import { BookIcon, ClockIcon, EditIcon, SaveIcon, XIcon } from "lucide-react";

interface TodoListProps {
  todos: TodoProps[];
  onTodoUpdate?: (todoId: number, updatedTodo: Partial<TodoProps>) => void;
}

interface TodoItemProps {
  todo: TodoProps;
  onUpdate: (todoId: number, updatedTodo: Partial<TodoProps>) => Promise<void>;
}

function TodoItem({ todo, onUpdate }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    startPage: todo.startPage,
    endPage: todo.endPage,
    minute: todo.minute,
    note: todo.note,
    studyGoal: todo.studyGoal,
  });

  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, { isDone: !todo.isDone });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    setIsUpdating(true);
    try {
      await onUpdate(todo.id, editData);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData({
      startPage: todo.startPage,
      endPage: todo.endPage,
      minute: todo.minute,
      note: todo.note,
      studyGoal: todo.studyGoal,
    });
    setIsEditing(false);
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        todo.isDone
          ? "border-green-200 bg-green-50/50"
          : "border-border hover:border-primary/50 hover:shadow-md"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Checkbox
            checked={todo.isDone}
            onCheckedChange={handleToggle}
            disabled={isUpdating}
            className="mt-1"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {new Date(todo.date).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                  })}
                </Badge>
                {todo.isDone && (
                  <Badge
                    variant="default"
                    className="text-xs bg-green-100 text-green-800 hover:bg-green-100"
                  >
                    완료
                  </Badge>
                )}
              </div>

              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
              )}
            </div>

            <h4
              className={`font-semibold mb-3 ${
                todo.isDone
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {todo.chapter}
            </h4>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      시작 페이지
                    </label>
                    <Input
                      type="text"
                      value={editData.startPage}
                      onChange={(e) =>
                        setEditData({ ...editData, startPage: e.target.value })
                      }
                      className="h-9"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      끝 페이지
                    </label>
                    <Input
                      type="text"
                      value={editData.endPage}
                      onChange={(e) =>
                        setEditData({ ...editData, endPage: e.target.value })
                      }
                      className="h-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    예상 시간 (분)
                  </label>
                  <Input
                    type="text"
                    value={editData.minute}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        minute: parseInt(e.target.value),
                      })
                    }
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    학습 목표
                  </label>
                  <Input
                    type="text"
                    value={editData.studyGoal}
                    onChange={(e) =>
                      setEditData({ ...editData, studyGoal: e.target.value })
                    }
                    className="h-9"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1 block">
                    노트
                  </label>
                  <Input
                    type="text"
                    value={editData.note}
                    onChange={(e) =>
                      setEditData({ ...editData, note: e.target.value })
                    }
                    className="h-9"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={isUpdating}
                  >
                    <SaveIcon className="h-4 w-4 mr-1" />
                    저장
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BookIcon className="w-4 h-4" />
                    <span>
                      페이지: {todo.startPage} - {todo.endPage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    <span>예상 시간: {todo.minute}분</span>
                  </div>
                </div>

                {todo.studyGoal && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium text-blue-700">
                        학습 목표:
                      </span>
                      <span className="ml-2 text-blue-600">
                        {todo.studyGoal}
                      </span>
                    </p>
                  </div>
                )}

                {todo.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {todo.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                {todo.note && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-medium text-amber-700">
                        노트:
                      </span>
                      <span className="ml-2 text-amber-600">
                        {todo.note}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TodoList({ todos, onTodoUpdate }: TodoListProps) {
  const handleTodoUpdate = async (
    todoId: number,
    updatedTodo: Partial<TodoProps>
  ) => {
    // isDone 업데이트의 경우 서버에 요청
    if ("isDone" in updatedTodo) {
      const success = await updateTodoStatus(todoId, updatedTodo.isDone!);
      if (success && onTodoUpdate) {
        onTodoUpdate(todoId, updatedTodo);
      }
    } else {
      // 다른 필드 업데이트의 경우 로컬에서만 업데이트
      if (onTodoUpdate) {
        onTodoUpdate(todoId, updatedTodo);
      }
    }
  };

  const completedTodos = todos.filter((todo) => todo.isDone);
  const pendingTodos = todos.filter((todo) => !todo.isDone);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Todo 목록</CardTitle>
          <Badge variant="secondary">
            {completedTodos.length} / {todos.length} 완료
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 진행 중인 Todo */}
        {pendingTodos.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              진행 중 ({pendingTodos.length})
            </h4>
            <div className="space-y-3">
              {pendingTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {/* 완료된 Todo */}
        {completedTodos.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              완료됨 ({completedTodos.length})
            </h4>
            <div className="space-y-3">
              {completedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleTodoUpdate}
                />
              ))}
            </div>
          </div>
        )}

        {todos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-muted-foreground">등록된 Todo가 없습니다.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
