import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BoardType, TaskCollectionType, TaskType } from "../datamodel/todoList";

export const BASE_URL = "https://test.com/api/v1/";

export const getGetBoardEndpoint = (boardId: string) => `board/${boardId}`;
export const getGetTaskCollectionEndpoint = (
  boardId: string,
  taskCollectionId: string
) => `${getGetBoardEndpoint(boardId)}/taskCollection/${taskCollectionId}`;
export const getGetTaskEndpoint = (boardId: string, taskId: string) =>
  `${getGetBoardEndpoint(boardId)}/task/${taskId}`;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getBoard: builder.query<BoardType, { boardId: string }>({
      query: ({ boardId }) => ({
        url: getGetBoardEndpoint(boardId),
        method: "GET",
      }),
    }),

    getTaskCollection: builder.query<
      TaskCollectionType,
      { boardId: string; taskCollectionId: string }
    >({
      query: ({ boardId, taskCollectionId }) => ({
        url: getGetTaskCollectionEndpoint(boardId, taskCollectionId),
        method: "GET",
      }),
    }),

    getTask: builder.query<TaskType, { boardId: string; taskId: string }>({
      query: ({ boardId, taskId }) => ({
        url: getGetTaskEndpoint(boardId, taskId),
        method: "GET",
      }),
    }),
  }),
});
