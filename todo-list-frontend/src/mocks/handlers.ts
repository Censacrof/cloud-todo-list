import { RestHandler, rest } from "msw";
import {
  BASE_URL,
  getBoardEndpoint,
  getTaskCollectionEndpoint,
  getTaskEndpoint,
} from "../api/api";
import {
  BoardType,
  Task,
  TaskCollectionType,
  TaskType,
} from "../datamodel/todoList";

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
  {
    boardId: "my-board",
    id: "done",
    name: "Done",
  },
];

const _tasks: TaskType[] = [
  {
    boardId: "my-board",
    id: "T-0",
    name: "This task is DONE",
    taskCollectionId: "done",
    description: "Finally",
  },
  {
    boardId: "my-board",
    id: "T-1",
    name: "A task",
    taskCollectionId: "todo",
    description: "Wow a task",
  },
];
let _tasksNextId = 2;

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

const handleGetTask = rest.get(
  BASE_URL + getTaskEndpoint(":boardId", ":taskId"),
  (req, res, ctx) => {
    const { boardId, taskId } = req.params;

    const collection = _tasks.find(
      ({ boardId: bId, id }) => bId === boardId && id === taskId
    );

    return res(ctx.status(200), ctx.json(collection));
  }
);

const handleFindTask = rest.get(
  BASE_URL + getTaskEndpoint(":boardId"),
  (req, res, ctx) => {
    const { boardId, taskId } = req.params;

    let tasks = _tasks.filter(({ boardId: bId }) => bId === boardId);

    if (taskId) {
      tasks = tasks.filter(({ id }) => id === taskId);
    }

    req.url.searchParams.forEach((val, key) => {
      if (!(key in Task.fields)) {
        return;
      }

      tasks = tasks.filter((task) => task[key as keyof TaskType] === val);
    });

    return res(ctx.status(200), ctx.json(tasks));
  }
);

const handleCreateTask = rest.post(
  BASE_URL + getTaskEndpoint(":boardId"),
  async (req, res, ctx) => {
    const { boardId } = req.params;

    try {
      const newTask = Task.check({
        id: `T-${_tasksNextId}`,
        boardId,
        ...(await req.json()),
      });

      _tasksNextId += 1;
      _tasks.push(newTask);

      return res(ctx.status(201), ctx.json(newTask));
    } catch {
      return res(ctx.status(400));
    }
  }
);

export const handlers: RestHandler[] = [
  handleGetBoard,
  handleGetTaskCollection,
  handleFindTaskCollection,
  handleGetTask,
  handleFindTask,
  handleCreateTask,
];
