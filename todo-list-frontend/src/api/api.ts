import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "https://test.com/api/v1/",
  }),
  endpoints: (builder) => ({
    getTestString: builder.query<string, void>({
      query: () => ({
        url: "test",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTestStringQuery } = api;
