import * as rt from "runtypes";

export const Task = rt.Record({
  id: rt.String,
  name: rt.String,
  description: rt.String.optional(),
});
export type TaskType = rt.Static<typeof Task>;

export const TaskCollection = rt.Record({
  id: rt.String,
  name: rt.String,
  tasks: rt.Union(rt.Array(Task), rt.Array(rt.String)),
});
export type TaskCollectionType = rt.Static<typeof TaskCollection>;

export const Board = rt.Record({
  id: rt.String,
  collections: rt.Union(rt.Array(TaskCollection), rt.Array(rt.String)),
});
export type BoardType = rt.Static<typeof Board>;
