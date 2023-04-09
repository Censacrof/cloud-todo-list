import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BoardType, TaskCollectionType, TaskType } from "../datamodel/todoList";

export const BASE_URL = "https://test.com/api/v1/";

export const getBoardEndpoint = (boardId: string) => `board/${boardId}`;
export const getTaskCollectionEndpoint = (
  boardId: string,
  taskCollectionId: string
) => `${getBoardEndpoint(boardId)}/taskCollection/${taskCollectionId}`;
export const getTaskEndpoint = (boardId: string, taskId?: string) =>
  `${getBoardEndpoint(boardId)}/task/${taskId}`;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.com/api/v1/",
  }),
  tagTypes: ["board", "collection", "task"],
  endpoints: (builder) => ({
    getBoard: builder.query<BoardType, { boardId: string }>({
      query: ({ boardId }) => ({
        url: getBoardEndpoint(boardId),
        method: "GET",
      }),
      providesTags: ["board"],
    }),

    getTaskCollection: builder.query<
      TaskCollectionType,
      { boardId: string; taskCollectionId: string }
    >({
      query: ({ boardId, taskCollectionId }) => ({
        url: getTaskCollectionEndpoint(boardId, taskCollectionId),
        method: "GET",
      }),
      providesTags: ["collection"],
    }),

    getTask: builder.query<TaskType, { boardId: string; taskId: string }>({
      query: ({ boardId, taskId }) => ({
        url: getTaskEndpoint(boardId, taskId),
        method: "GET",
      }),
      providesTags: ["task"],
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
    }),
  }),
});
