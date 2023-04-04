import classNames from "classnames";
import { DragEvent, FC, useCallback, useState } from "react";
import { useGetBoardQuery } from "../api/api";
import { TaskType, TasksCollectionType } from "../datamodel/todoList";

export const BoardComponent: FC = function BoardComponent() {
  const {
    data: boardData,
    isFetching,
    isError,
  } = useGetBoardQuery("my-BoardComponent");

  const [tasksTodo, setTasksTodo] = useState<TaskType[]>([
    createTask({
      name: "Do stuff",
      description: "you got stuff todo!",
    }),
  ]);

  const [tasksDone, setTasksDone] = useState<TaskType[]>([]);

  const handleAddTodoTask = useCallback(
    (task: TaskType) => {
      setTasksTodo([...tasksTodo, task]);
    },
    [tasksTodo]
  );
  const handleRemoveTodoTask = useCallback(
    (task: TaskType) => {
      setTasksTodo(tasksTodo.filter((t) => t.id !== task.id));
    },
    [tasksTodo]
  );

  const handleAddDoneTask = useCallback(
    (task: TaskType) => {
      setTasksDone([...tasksDone, task]);
    },
    [tasksDone]
  );
  const handleRemoveDoneTask = useCallback(
    (task: TaskType) => {
      setTasksDone(tasksDone.filter((t) => t.id !== task.id));
    },
    [tasksDone]
  );

  return (
    <>
      {isFetching && <p>fetching BoardComponent...</p>}
      {isError && <p>error fetching BoardComponent</p>}
      {boardData && (
        <div className="flex flex-row justify-between gap-5">
          {boardData.collections.map((collection) => (
            <BoardComponentColumn
              key={collection.id}
              tasksCollection={collection}
              onAdd={() => {
                //
              }}
              onRemove={() => {
                //
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

interface BoardComponentColumnProps {
  tasksCollection: TasksCollectionType;
  onAdd: (task: TaskType) => void;
  onRemove: (task: TaskType) => void;
}
const BoardComponentColumn: FC<BoardComponentColumnProps> =
  function BoardComponentColumn({ tasksCollection, onAdd, onRemove }) {
    const handleDrop = useCallback(
      (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const task: TaskType | undefined = JSON.parse(
          event.dataTransfer.getData("task")
        );

        task && onAdd(task);
      },
      [onAdd]
    );

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    }, []);

    const handleNewTask = useCallback(() => {
      onAdd(
        createTask({
          name: "A new task",
          description: "New 'n tasty",
        })
      );
    }, [onAdd]);

    return (
      <div
        className="w-80 flex flex-col items-center min-h-[30rem] bg-slate-300"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="w-full flex flex-row justify-center items-center gap-4">
          <p className="p-2">{tasksCollection.name}</p>
          {
            <button className="p-1 rounded bg-slate-50" onClick={handleNewTask}>
              new
            </button>
          }
        </div>
        <div className="w-full flex flex-col gap-4 px-2">
          {tasksCollection.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnName={tasksCollection.name}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    );
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
  columnName: string;
  task: TaskType;
  onRemove: (task: TaskType) => void;
}
const TaskCard: FC<TaskCardProps> = function TaskCard({
  columnName,
  task,
  onRemove,
}) {
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  const handleDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("sourceColumnName", columnName);
      event.dataTransfer.setData("task", JSON.stringify(task));
      setIsBeingDragged(true);
    },
    [columnName, task]
  );

  const handleDragEnd = useCallback(() => {
    setIsBeingDragged(false);
    onRemove(task);
  }, [onRemove, task]);

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={classNames(
        "w-full flex flex-col rounded-3xl p-4 bg-slate-50",
        {
          "opacity-0": isBeingDragged,
        }
      )}
    >
      <h3>{task.name}</h3>
      <p>{task.description}</p>
    </div>
  );
};
