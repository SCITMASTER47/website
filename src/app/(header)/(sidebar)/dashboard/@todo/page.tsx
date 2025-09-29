import TodoList from "@/_components/todo_list";
import { getTodayTodos } from "@/_action-server/schedule";
import { TodoProps } from "@/_types/schedule";
import { TrophyIcon } from "@/_ui/svg/svg";

// 동적 렌더링 강제 - 쿠키 접근이 필요한 페이지
export const dynamic = "force-dynamic";

export default async function TodoPage() {
  let todos: TodoProps[] = [];

  try {
    todos = await getTodayTodos();
  } catch {
    return <TodoError />;
  }

  // todo가 없을 때 처리
  if (todos.length === 0) {
    return <NoTodos />;
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

function NoTodos() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <span className="flex items-center gap-2">
        <TrophyIcon />
        <span className="text-gray-600 text-xs font-semibold">
          오늘 예정된 일정이 없습니다.
        </span>
      </span>
    </div>
  );
}
