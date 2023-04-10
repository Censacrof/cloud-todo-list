import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import qs from "qs";
import { BoardType, TaskCollectionType, TaskType } from "../datamodel/todoList";

export const BASE_URL = "https://test.com/api/v1/";

export const getBoardEndpoint = (boardId: string) => `board/${boardId}`;
export const getTaskCollectionEndpoint = (
  boardId: string,
  taskCollectionId?: string
) => `${getBoardEndpoint(boardId)}/taskCollection/${taskCollectionId || ""}`;
export const getTaskEndpoint = (boardId: string, taskId?: string) =>
  `${getBoardEndpoint(boardId)}/task/${taskId || ""}`;

export type FindResourceParamsType<T> = {
  where?: Partial<T>;
  sortBy?: keyof T;
};

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.com/api/v1/",
    paramsSerializer: (params) => qs.stringify(params),
  }),
  tagTypes: [
    "getBoard",
    "findBoard",
    "getCollection",
    "findCollection",
    "getTask",
    "findTask",
  ],
  endpoints: (builder) => ({
    getBoard: builder.query<BoardType, { boardId: string }>({
      query: ({ boardId }) => ({
        url: getBoardEndpoint(boardId),
        method: "GET",
      }),
      providesTags: ["getBoard"],
    }),

    getTaskCollection: builder.query<
      TaskCollectionType,
      { boardId: string; taskCollectionId: string }
    >({
      query: ({ boardId, taskCollectionId }) => ({
        url: getTaskCollectionEndpoint(boardId, taskCollectionId),
        method: "GET",
      }),
      providesTags: ["getCollection"],
    }),

    findTaskCollection: builder.query<
      TaskCollectionType[],
      { boardId: string }
    >({
      query: ({ boardId }) => ({
        url: getTaskCollectionEndpoint(boardId),
        method: "GET",
      }),
      providesTags: ["findCollection"],
    }),

    getTask: builder.query<TaskType, { boardId: string; taskId: string }>({
      query: ({ boardId, taskId }) => ({
        url: getTaskEndpoint(boardId, taskId),
        method: "GET",
      }),
      providesTags: ["getTask"],
    }),

    findTask: builder.query<
      TaskType[],
      { boardId: string; params: FindResourceParamsType<TaskType> }
    >({
      query: ({ boardId, params }) => ({
        url: getTaskEndpoint(boardId),
        params,
        method: "GET",
      }),
      providesTags: ["findTask"],
    }),

    createTask: builder.mutation<
      TaskType,
      { boardId: string; task: Omit<TaskType, "id"> }
    >({
      query: ({ boardId, task }) => ({
        url: getTaskEndpoint(boardId),
        body: task,
        method: "POST",
      }),
      invalidatesTags: ["findTask"],
    }),

    updateTask: builder.mutation<
      TaskType,
      { boardId: string; taskId: string; task: TaskType }
    >({
      query: ({ boardId, taskId, task }) => ({
        url: getTaskEndpoint(boardId, taskId),
        body: task,
        method: "PUT",
      }),
      invalidatesTags: ["getTask", "findTask"],
    }),
  }),
});
