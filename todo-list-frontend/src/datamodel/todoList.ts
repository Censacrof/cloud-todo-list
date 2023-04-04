import * as rt from "runtypes";

export const Task = rt.Record({
  id: rt.String,
  name: rt.String,
  description: rt.String.optional(),
});
export type TaskType = rt.Static<typeof Task>;

export const TasksCollection = rt.Record({
  id: rt.String,
  name: rt.String,
  tasks: rt.Array(Task),
});
export type TasksCollectionType = rt.Static<typeof TasksCollection>;

export const Board = rt.Record({
  id: rt.String,
  collections: rt.Array(TasksCollection),
});
export type BoardType = rt.Static<typeof Board>;
