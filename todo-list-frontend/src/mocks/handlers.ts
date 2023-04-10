import { RestHandler, rest } from "msw";
import qs from "qs";
import {
  BASE_URL,
  FindResourceParamsType,
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

let _tasks: TaskType[] = [
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
    const { boardId } = req.params;

    let tasks = _tasks.filter(({ boardId: bId }) => bId === boardId);

    const searchParams: FindResourceParamsType<TaskType> = qs.parse(
      req.url.search,
      { ignoreQueryPrefix: true }
    );

    Object.entries(searchParams.where || {}).forEach(([key, val]) => {
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

const handleUpdateTask = rest.put(
  BASE_URL + getTaskEndpoint(":boardId", ":taskId"),
  async (req, res, ctx) => {
    const { taskId } = req.params;

    const updatedTask = await req.json();

    if (!Task.guard(updatedTask)) {
      return res(ctx.status(400));
    }

    _tasks = _tasks.filter((t) => t.id !== taskId);
    const targetIndex = updatedTask.index || _tasks.length;
    const tasksInCollection = [
      ..._tasks.filter(
        (t) => t.taskCollectionId === updatedTask.taskCollectionId
      ),
    ];
    tasksInCollection.sort((a, b) => (a.index || 0) - (b.index || 0));
    tasksInCollection.forEach((t, i) => {
      t.index = i < targetIndex ? i : i + 1;
    });
    _tasks.push({ ...updatedTask, index: targetIndex });

    return res(ctx.status(200), ctx.json(updatedTask));
  }
);

export const handlers: RestHandler[] = [
  handleGetBoard,
  handleGetTaskCollection,
  handleFindTaskCollection,
  handleGetTask,
  handleFindTask,
  handleCreateTask,
  handleUpdateTask,
];
