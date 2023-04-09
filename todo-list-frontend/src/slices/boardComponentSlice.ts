import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const boardComponentSlice = createSlice({
  name: "boardComponent",
  initialState: {
    isDragging: false,
  },
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
  },
});
