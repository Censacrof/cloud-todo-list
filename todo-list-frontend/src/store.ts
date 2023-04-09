import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api/api";
import { boardComponentSlice } from "./slices/boardComponentSlice";

const reducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [boardComponentSlice.name]: boardComponentSlice.reducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type AppStore = ReturnType<typeof reducer>;
