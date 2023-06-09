import { FC, ReactNode, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { api } from "../api/api";
import { Task, TaskType } from "../datamodel/todoList";
import { boardComponentSlice } from "../slices/boardComponentSlice";
import { AppStore, useAppDispatch } from "../store";

export const BoardComponent: FC = memo(function BoardComponent() {
  const boardId = "my-board";

  const {
    data: boardData,
    isFetching,
    isError,
  } = api.useGetBoardQuery({ boardId });

  const { data: collectionsData } = api.useFindTaskCollectionQuery({ boardId });

  return (
    <>
      {isFetching && <p>fetching BoardComponent...</p>}
      {isError && <p>error fetching BoardComponent</p>}
      {boardData && (
        <div className="flex flex-row justify-between gap-5">
          {collectionsData?.map((collection) => {
            const collectionId =
              typeof collection === "string" ? collection : collection.id;
            return (
              <BoardComponentColumn
                key={collectionId}
                boardId={boardId}
                taskCollectionId={collectionId}
              />
            );
          })}
        </div>
      )}
    </>
  );
});

interface BoardComponentColumnProps {
  boardId: string;
  taskCollectionId: string;
}
const BoardComponentColumn: FC<BoardComponentColumnProps> = memo(
  function BoardComponentColumn({ boardId, taskCollectionId }) {
    const { data: taskCollectionData } = api.useGetTaskCollectionQuery({
      boardId,
      taskCollectionId,
    });

    const { data: tasksData } = api.useFindTaskQuery({
      boardId,
      params: {
        where: {
          taskCollectionId,
        },
        sortBy: "taskCollectionId",
      },
    });

    const [createTask] = api.useCreateTaskMutation();
    const [updateTask] = api.useUpdateTaskMutation();

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    }, []);

    const onDrop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        const task = JSON.parse(event.dataTransfer.getData("task"));
        if (!Task.guard(task)) {
          return;
        }

        updateTask({
          boardId: task.boardId,
          taskId: task.id,
          task: {
            ...task,
            taskCollectionId,
          },
        });
      },
      [taskCollectionId, updateTask]
    );

    return (
      <div
        className="w-80 flex flex-col items-center min-h-[30rem] bg-slate-300"
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {taskCollectionData && (
          <>
            <div className="w-full flex flex-row justify-center items-center gap-4">
              <p className="p-2">{taskCollectionData.name}</p>
              {
                <button
                  className="p-1 rounded bg-slate-50"
                  onClick={() => {
                    createTask({
                      boardId,
                      task: {
                        boardId,
                        taskCollectionId,
                        name: "A new task",
                        description: "New 'n tasty",
                      },
                    });
                  }}
                >
                  new
                </button>
              }
            </div>
            <div className="w-full flex flex-col px-2">
              {tasksData?.map((task, i) => {
                return (
                  <SortingDropContainer
                    key={task.id}
                    onDrop={(event, zone) => {
                      event.stopPropagation();
                      const droppedTask = JSON.parse(
                        event.dataTransfer.getData("task")
                      );

                      updateTask({
                        boardId,
                        taskId: droppedTask.id,
                        task: {
                          ...droppedTask,
                          taskCollectionId,
                          index: zone === "bottom" ? i + 1 : i,
                        },
                      });
                    }}
                  >
                    <div className="py-2">
                      <TaskCard task={task} />
                    </div>
                  </SortingDropContainer>
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  }
);

interface SortingDropContainerProps {
  onDrop?: (
    event: React.DragEvent<HTMLDivElement>,
    zone: "top" | "bottom"
  ) => void;
  children?: ReactNode;
}
const SortingDropContainer: FC<SortingDropContainerProps> = memo(
  function SortingDropContainer({ onDrop, children }) {
    const isDragging = useSelector(
      (state: AppStore) => state.boardComponent.isDragging
    );

    const handleDropBottom = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        onDrop?.(event, "bottom");
      },
      [onDrop]
    );

    const handleDropTop = useCallback(
      (event: React.DragEvent<HTMLDivElement>) => {
        onDrop?.(event, "top");
      },
      [onDrop]
    );

    return (
      <div className="relative">
        {children}
        <>
          {isDragging && (
            <div className="absolute inset-0 flex flex-col items-stretch justify-stretch">
              <div
                onDrop={handleDropTop}
                className="grow hover:bg-red-50 hover:border-t-2 border-orange-500"
              />
              <div
                onDrop={handleDropBottom}
                className="grow hover:bg-red-50 hover:border-t-2 border-orange-500"
              />
            </div>
          )}
        </>
      </div>
    );
  }
);

interface TaskCardProps {
  task: TaskType;
}
const TaskCard: FC<TaskCardProps> = memo(function TaskCard({ task }) {
  const dispatch = useAppDispatch();

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("task", JSON.stringify(task));

      // need to call dispatch inside timeout to prevent
      // 'dragend' to fire immediatly
      setTimeout(() => {
        dispatch(boardComponentSlice.actions.setIsDragging(true));
      }, 1);
    },
    [dispatch, task]
  );

  const handleDragEnd = useCallback(() => {
    dispatch(boardComponentSlice.actions.setIsDragging(false));
  }, [dispatch]);

  return (
    <div
      draggable={true}
      className={"w-full flex flex-col rounded-3xl p-4 bg-slate-50"}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <h3>{task.name}</h3>
      <p>{task.description}</p>
    </div>
  );
});
