import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "boardComponent";

export const boardComponentSlice = createSlice({
  name: SLICE_NAME,
  initialState: {
    isDragging: false,
  },
  reducers: {
    setIsDragging: (state, action: PayloadAction<boolean>) => {
      state.isDragging = action.payload;
    },
  },
});
