import { RestHandler, rest } from "msw";
import {
  BASE_URL,
  getBoardEndpoint,
  getTaskCollectionEndpoint,
  getTaskEndpoint,
} from "../api/api";
import { BoardType, TaskCollectionType, TaskType } from "../datamodel/todoList";

const _boards = new Map<string, BoardType>();
_boards.set("my-board", {
  id: "my-board",
  collections: [
    {
      id: "todo-0",
      name: "TODO",
      tasks: [
        {
          id: "T-0",
          name: "Do stuff",
          description: "Got stuff to do",
        },
      ],
    },
    {
      id: "done-0",
      name: "Done",
      tasks: [],
    },
  ],
});

const handleGetBoard = rest.get(
  BASE_URL + getBoardEndpoint(":boardId"),
  (req, res, ctx) => {
    const { boardId } = req.params;

    const board = JSON.parse(JSON.stringify(_boards.get(boardId as string)));
    if (!board) {
      return res(ctx.status(404));
    }

    board.collections = (board.collections as TaskCollectionType[]).map(
      (c) => c.id
    );

    return res(ctx.status(200), ctx.json(board));
  }
);

const handleGetTaskCollection = rest.get(
  BASE_URL + getTaskCollectionEndpoint(":boardId", ":taskCollectionId"),
  (req, res, ctx) => {
    const { boardId, taskCollectionId } = req.params;

    const board = JSON.parse(JSON.stringify(_boards.get(boardId as string)));
    if (!board) {
      return res(ctx.status(404));
    }

    const taskCollection = (board.collections as TaskCollectionType[]).find(
      (c) => c.id === taskCollectionId
    );
    if (!taskCollection) {
      return res(ctx.status(404));
    }

    taskCollection.tasks = (taskCollection.tasks as TaskType[]).map(
      (t) => t.id
    );

    return res(ctx.status(200), ctx.json(taskCollection));
  }
);

const handleGetTask = rest.get(
  BASE_URL + getTaskEndpoint(":boardId", ":taskId"),
  (req, res, ctx) => {
    const { boardId, taskId } = req.params;

    const board = JSON.parse(JSON.stringify(_boards.get(boardId as string)));
    if (!board) {
      return res(ctx.status(404));
    }

    const allTasks = (board.collections as TaskCollectionType[])
      .map((c) => c.tasks as TaskType[])
      .flat();
    console.log(board.collections);
    console.log(_boards);

    const task = allTasks.find((t) => t.id === taskId);
    if (!task) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(task));
  }
);

export const handlers: RestHandler[] = [
  handleGetBoard,
  handleGetTaskCollection,
  handleGetTask,
];
