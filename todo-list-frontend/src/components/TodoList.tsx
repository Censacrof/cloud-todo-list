import { FC } from "react";

export const TodoList: FC = function TodoList() {
  return (
    <div className="flex flex-row justify-between gap-5">
      <TodoListColumn columnName={"TODO"} />
      <TodoListColumn columnName={"Done"} />
    </div>
  );
};

interface TodoListColumnProps {
  columnName: string;
}
const TodoListColumn: FC<TodoListColumnProps> = function TodoListColumn({
  columnName,
}) {
  return (
    <div className="w-80 flex flex-col items-center min-h-[30rem] bg-slate-300">
      <p className="p-2">{columnName}</p>
      <div className="w-full flex flex-col gap-4 px-2">
        <TaskCard
          taskName={"Do stuff"}
          taskDescription={"you gout stuff todo!"}
        />
      </div>
    </div>
  );
};

interface TaskCardProps {
  taskName: string;
  taskDescription: string;
}
const TaskCard: FC<TaskCardProps> = function TaskCard({
  taskName,
  taskDescription,
}) {
  return (
    <div className="w-full flex flex-col rounded-3xl p-4 bg-slate-50">
      <h3>{taskName}</h3>
      <p>{taskDescription}</p>
    </div>
  );
};
