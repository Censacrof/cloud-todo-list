import { FC, ReactNode, useCallback } from "react";
import { useSelector } from "react-redux";
import { api } from "../api/api";
import { Task, TaskType } from "../datamodel/todoList";
import { boardComponentSlice } from "../slices/boardComponentSlice";
import { AppStore, useAppDispatch } from "../store";

export const BoardComponent: FC = function BoardComponent() {
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
};

interface BoardComponentColumnProps {
  boardId: string;
  taskCollectionId: string;
}
const BoardComponentColumn: FC<BoardComponentColumnProps> =
  function BoardComponentColumn({ boardId, taskCollectionId }) {
    const { data: taskCollectionData } = api.useGetTaskCollectionQuery({
      boardId,
      taskCollectionId,
    });

    const { data: tasksData } = api.useFindTaskQuery({
      boardId,
      filters: {
        taskCollectionId,
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
              {tasksData?.map((task) => {
                return (
                  <SortingDropContainer key={task.id}>
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
  };

const SortingDropContainer: FC<{
  onDropUpper?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDropLower?: (event: React.DragEvent<HTMLDivElement>) => void;
  children?: ReactNode;
}> = ({ onDropUpper, onDropLower, children }) => {
  const isDragging = useSelector(
    (state: AppStore) => state.boardComponent.isDragging
  );

  return (
    <div className="relative">
      {children}
      {isDragging && (
        <div className="absolute inset-0 flex flex-col items-stretch justify-stretch">
          <div onDrop={onDropUpper} className="grow" />
          <div onDrop={onDropLower} className="grow" />
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: TaskType;
}
const TaskCard: FC<TaskCardProps> = function TaskCard({ task }) {
  const dispatch = useAppDispatch();

  const handleDragStart = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("task", JSON.stringify(task));
      dispatch(boardComponentSlice.actions.setIsDragging(true));
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
};
