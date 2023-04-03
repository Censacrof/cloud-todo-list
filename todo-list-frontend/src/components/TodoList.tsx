import { FC, useState } from "react";

export const TodoList: FC = function TodoList() {
  const [tasksTodo, setTasksTodo] = useState<TaskType[]>([
    createTask({
      name: "Do stuff",
      description: "you got stuff todo!",
    }),
  ]);

  const [tasksDone, setTasksDone] = useState<TaskType[]>([]);

  return (
    <div className="flex flex-row justify-between gap-5">
      <TodoListColumn columnName={"TODO"} tasks={tasksTodo} />
      <TodoListColumn columnName={"Done"} tasks={tasksDone} />
    </div>
  );
};

interface TodoListColumnProps {
  columnName: string;
  tasks: TaskType[];
}
const TodoListColumn: FC<TodoListColumnProps> = function TodoListColumn({
  columnName,
  tasks,
}) {
  return (
    <div className="w-80 flex flex-col items-center min-h-[30rem] bg-slate-300">
      <p className="p-2">{columnName}</p>
      <div className="w-full flex flex-col gap-4 px-2">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

type TaskType = {
  id: string;
  name: string;
  description: string;
};

let _nextTaskId = 0;
const createTask = ({ description, name }: Omit<TaskType, "id">): TaskType => {
  const id = _nextTaskId;
  _nextTaskId += 1;
  return {
    id: `T-${id}`,
    name,
    description,
  };
};

interface TaskCardProps {
  task: TaskType;
}
const TaskCard: FC<TaskCardProps> = function TaskCard({ task }) {
  const { name, description } = task;

  return (
    <div className="w-full flex flex-col rounded-3xl p-4 bg-slate-50">
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
};
