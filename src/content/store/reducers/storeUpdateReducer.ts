import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ContentRootState } from "../store.js";

const initialState: ContentRootState = {
  config: { config: null },
  iconPosition: { googleIconPosition: null },
};

export const storeUpdateSlice = createSlice({
  name: "@@storeUpdate",
  initialState,
  reducers: {
    updateStore: (state, action: PayloadAction<ContentRootState>) => {
      return action.payload;
    },
  },
});

export const { updateStore } = storeUpdateSlice.actions;
