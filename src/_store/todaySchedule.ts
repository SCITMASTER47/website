import { completeTodo } from "@/_action-server/schedule";
import { TodoProps } from "@/_types/schedule";
import { create } from "zustand";

interface todayScheduleStore {
  todos: TodoProps[];
  isLoading: boolean;
  doneTodoCount: number;
  notCompletedTodoCount: number;
  totalTodoCount: number;
  setTodos: (todos: TodoProps[]) => void;
  onClickComplete: (todoId: number, status: boolean) => Promise<void>;
}

export const useTodayScheduleStore = create<todayScheduleStore>((set, get) => ({
  todos: [],
  isLoading: false,
  doneTodoCount: 0,
  notCompletedTodoCount: 0,
  inProgressTodoCount: 0,
  totalTodoCount: 0,
  setTodos: (todos: TodoProps[]) => {
    if (!todos) {
      set({
        todos: [],
        doneTodoCount: 0,
        notCompletedTodoCount: 0,
      });
      return;
    }

    const completedCount = todos.filter((t) => t.isDone).length;
    const notCompletedCount = todos.filter((t) => !t.isDone).length;

    set({
      todos: todos,
      doneTodoCount: completedCount,
      notCompletedTodoCount: notCompletedCount,
      totalTodoCount: todos.length,
    });
  },

  onClickComplete: async (todoId: number, status: boolean) => {
    const { todos } = get();
    const targetTodo = todos.find((t) => t.id === todoId);
    if (!targetTodo) return;

    const previousStatus = targetTodo.isDone;

    // 즉시 UI 업데이트
    set((state) => {
      const updatedTodos = state.todos.map((todo) =>
        todo.id === todoId ? { ...todo, isDone: status } : todo
      );

      const completedCount = updatedTodos.filter((t) => t.isDone).length;
      const notCompletedCount = updatedTodos.filter((t) => !t.isDone).length;

      return {
        ...state,
        todos: updatedTodos,
        doneTodoCount: completedCount,
        notCompletedTodoCount: notCompletedCount,
      };
    });

    // 백그라운드에서 서버 요청
    try {
      await completeTodo(todoId, status, targetTodo.date);
    } catch (error) {
      // 실패시 롤백

      set((state) => {
        const rolledBackTodos = state.todos.map((todo) =>
          todo.id === todoId ? { ...todo, isDone: previousStatus } : todo
        );

        const completedCount = rolledBackTodos.filter((t) => t.isDone).length;
        const notCompletedCount = rolledBackTodos.filter(
          (t) => !t.isDone
        ).length;

        return {
          ...state,
          todos: rolledBackTodos,
          doneTodoCount: completedCount,
          notCompletedTodoCount: notCompletedCount,
        };
      });
    }
  },
}));
