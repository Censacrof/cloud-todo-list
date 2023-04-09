import { RestHandler, rest } from "msw";
import {
  BASE_URL,
  getBoardEndpoint,
  getTaskCollectionEndpoint,
} from "../api/api";
import { BoardType, TaskCollectionType } from "../datamodel/todoList";

const _boards: BoardType[] = [
  {
    id: "my-board",
    name: "My board",
  },
];

const _collections: TaskCollectionType[] = [
  {
    boardId: "my-board",
    id: "todo",
    name: "TODO",
  },
];

// const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj))

const handleGetBoard = rest.get(
  BASE_URL + getBoardEndpoint(":boardId"),
  (req, res, ctx) => {
    const { boardId } = req.params;

    const board = _boards.find(({ id }) => id === boardId);

    if (!board) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(board));
  }
);

const handleGetTaskCollection = rest.get(
  BASE_URL + getTaskCollectionEndpoint(":boardId", ":taskCollectionId"),
  (req, res, ctx) => {
    const { boardId, taskCollectionId } = req.params;

    const collection = _collections.find(
      ({ boardId: bId, id }) => bId === boardId && id === taskCollectionId
    );

    return res(ctx.status(200), ctx.json(collection));
  }
);

const handleFindTaskCollection = rest.get(
  BASE_URL + getTaskCollectionEndpoint(":boardId"),
  (req, res, ctx) => {
    const { boardId, taskCollectionId } = req.params;

    let collections = _collections.filter(
      ({ boardId: bId }) => bId === boardId
    );

    if (taskCollectionId) {
      collections = collections.filter(({ id }) => id === taskCollectionId);
    }

    return res(ctx.status(200), ctx.json(collections));
  }
);

// const handleGetTask = rest.get(
//   BASE_URL + getTaskEndpoint(":boardId", ":taskId"),
//   (req, res, ctx) => {
//     const { boardId, taskId } = req.params;

//     const board = JSON.parse(JSON.stringify(_boards.get(boardId as string)));
//     if (!board) {
//       return res(ctx.status(404));
//     }

//     const allTasks = (board.collections as TaskCollectionType[])
//       .map((c) => c.tasks as TaskType[])
//       .flat();
//     console.log(board.collections);
//     console.log(_boards);

//     const task = allTasks.find((t) => t.id === taskId);
//     if (!task) {
//       return res(ctx.status(404));
//     }

//     return res(ctx.status(200), ctx.json(task));
//   }
// );

// const handlePostTask = rest.post(
//   BASE_URL + getTaskEndpoint(":boardId"),
//   (req, res, ctx) => {
//     const { boardId, taskId } = req.params;

//     const board = JSON.parse(JSON.stringify(_boards.get(boardId as string)));
//     if (!board) {
//       return res(ctx.status(404));
//     }

//     const allTasks = (board.collections as TaskCollectionType[])
//       .map((c) => c.tasks as TaskType[])
//       .flat();
//     console.log(board.collections);
//     console.log(_boards);

//     const task = allTasks.find((t) => t.id === taskId);
//     if (!task) {
//       return res(ctx.status(404));
//     }

//     return res(ctx.status(200), ctx.json(task));
//   }
// );

export const handlers: RestHandler[] = [
  handleGetBoard,
  handleGetTaskCollection,
  handleFindTaskCollection,
  // handleGetTask,
];
