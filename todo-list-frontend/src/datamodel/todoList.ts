import * as rt from "runtypes";

export const Task = rt.Record({
  id: rt.String,
  boardId: rt.String,
  taskCollectionId: rt.String,
  name: rt.String,
  description: rt.String.optional(),
  index: rt.Number.optional(),
});
export type TaskType = rt.Static<typeof Task>;

export const TaskCollection = rt.Record({
  id: rt.String,
  boardId: rt.String,
  name: rt.String,
});
export type TaskCollectionType = rt.Static<typeof TaskCollection>;

export const Board = rt.Record({
  id: rt.String,
  name: rt.String,
});
export type BoardType = rt.Static<typeof Board>;
