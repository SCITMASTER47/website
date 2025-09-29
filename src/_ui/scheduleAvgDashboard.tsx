import { TodoProps } from "@/_types/schedule";
import { Card } from "./card";

export default function ScheduleAvgDashboard({
  todos,
}: {
  todos: TodoProps[];
}) {
  const completedTodos = todos.filter((todo) => todo.isDone).length;
  const progressPercentage =
    todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;
  return (
    <div>
      {" "}
      {todos.length > 0 && (
        <div className="p-6 border-b border-gray-100  flex-shrink-0">
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4 text-center bg-blue-50 border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {todos.length}
              </div>
              <div className="text-xs text-blue-500 font-medium">전체 할일</div>
            </Card>
            <Card className="p-4 text-center bg-green-50 border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {completedTodos}
              </div>
              <div className="text-xs text-green-500 font-medium">완료</div>
            </Card>
            <Card className="p-4 text-center bg-orange-50 border-orange-200">
              <div className="text-2xl font-bold text-orange-600">
                {todos.length - completedTodos}
              </div>
              <div className="text-xs text-orange-500 font-medium">진행중</div>
            </Card>
            <Card className="p-4 text-center bg-purple-50 border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {todos.reduce((total, todo) => total + todo.minute, 0)}분
              </div>
              <div className="text-xs text-purple-500 font-medium">
                총 학습시간
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
