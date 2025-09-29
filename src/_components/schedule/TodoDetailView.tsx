"use client";
import { TodoProps } from "@/_types/schedule";
import Todo from "../todo";
import {
  completeTodo,
  updateTodoDetails,
  deleteTodo,
} from "@/_action-server/schedule";
import { useOptimistic, useTransition } from "react";

export default function TodoDetailView({ todos }: { todos: TodoProps[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    todos,
    (
      state,
      action: {
        type: "complete" | "edit" | "delete";
        todoId: number;
        status?: boolean;
        updatedTodo?: TodoProps;
      }
    ): TodoProps[] => {
      if (action.type === "complete" && typeof action.status === "boolean") {
        return state.map((todo) =>
          todo.id === action.todoId ? { ...todo, isDone: action.status! } : todo
        );
      } else if (action.type === "edit" && action.updatedTodo) {
        return state.map((todo) =>
          todo.id === action.todoId ? action.updatedTodo! : todo
        );
      } else if (action.type === "delete") {
        return state.filter((todo) => todo.id !== action.todoId);
      }
      return state;
    }
  );

  const handleClickComplete = async (todoId: number, status: boolean) => {
    startTransition(() => {
      updateOptimisticTodos({ type: "complete", todoId, status });
    });

    try {
      await completeTodo(todoId, status);
    } catch (error) {
      console.error("Failed to complete todo:", error);
    }
  };

  const handleClickEdit = async (updatedTodo: TodoProps) => {
    // 원본 데이터 찾기
    const originalTodo = todos.find((todo) => todo.id === updatedTodo.id);
    if (!originalTodo) {
      console.error("Original todo not found");
      return;
    }

    startTransition(() => {
      updateOptimisticTodos({
        type: "edit",
        todoId: updatedTodo.id,
        updatedTodo,
      });
    });

    try {
      // 원본 데이터와 변경할 데이터만 추출
      const updateData = {
        chapter: updatedTodo.chapter,
        startPage: updatedTodo.startPage,
        endPage: updatedTodo.endPage,
        keywords: updatedTodo.keywords,
        note: updatedTodo.note,
        studyGoal: updatedTodo.studyGoal,
        minute: updatedTodo.minute,
      };

      await updateTodoDetails(updatedTodo.id, originalTodo, updateData);
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  // handle Click delete todo with optimistic update
  const handleClickDelete = async (todoId: number) => {
    // 삭제 확인 다이얼로그
    if (!confirm("정말로 이 할일을 삭제하시겠습니까?")) {
      return;
    }

    startTransition(() => {
      // Optimistic update - 즉시 UI에서 제거
      updateOptimisticTodos({ type: "delete", todoId });
    });

    try {
      await deleteTodo(todoId);
    } catch (error) {
      console.error("Failed to delete todo:", error);
      // 에러 발생 시 페이지 새로고침으로 원래 상태 복원
      // TODO: 더 좋은 에러 처리 방법 구현 가능
    }
  };

  return (
    <div className="space-y-4">
      {isPending && (
        <div className="text-center text-sm text-gray-500 py-2">처리 중...</div>
      )}
      {optimisticTodos.map((todo) => (
        <Todo
          key={todo.id}
          {...todo}
          readOnly={false}
          editable={true}
          onClickDone={handleClickComplete}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
        />
      ))}
    </div>
  );
}
