import TodoList from "@/_components/todo_list";
import { getTodayTodos } from "@/_action-server/schedule";
import { TodoProps } from "@/_types/schedule";
import { TrophyIcon } from "@/_ui/svg/svg";

export default async function TodoPage() {
  let todos: TodoProps[] = [];

  try {
    todos = await getTodayTodos();
  } catch {
    return <TodoError />;
  }

  return <TodoList data={todos} />;
}

function TodoError() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="flex items-center gap-2">
        <TrophyIcon />
        <span className="text-gray-600 text-xs font-semibold">
          할 일 목록을 가져오는 중 오류가 발생했습니다.
        </span>
      </span>
    </div>
  );
}
