import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BoardType } from "../datamodel/todoList";

export const BASE_URL = "https://test.com/api/v1/";

export const getGetBoardEndpoint = (boardId: string) => `board/${boardId}`;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getBoard: builder.query<BoardType, string>({
      query: (boardId) => ({
        url: getGetBoardEndpoint(boardId),
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBoardQuery } = api;
