import { FC } from "react";
import { api } from "../api/api";

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

    return (
      <div className="w-80 flex flex-col items-center min-h-[30rem] bg-slate-300">
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
            <div className="w-full flex flex-col gap-4 px-2">
              {tasksData?.map((task) => {
                const taskId = typeof task === "string" ? task : task.id;
                return (
                  <TaskCard key={taskId} boardId={boardId} taskId={taskId} />
                );
              })}
            </div>
          </>
        )}
      </div>
    );
  };

interface TaskCardProps {
  boardId: string;
  taskId: string;
}
const TaskCard: FC<TaskCardProps> = function TaskCard({ boardId, taskId }) {
  const { data: taskData } = api.useGetTaskQuery({
    boardId,
    taskId,
  });

  return (
    <div
      draggable={true}
      className={"w-full flex flex-col rounded-3xl p-4 bg-slate-50"}
    >
      {taskData && (
        <>
          <h3>{taskData.name}</h3>
          <p>{taskData.description}</p>
        </>
      )}
    </div>
  );
};
