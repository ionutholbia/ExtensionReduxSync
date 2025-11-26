import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IconPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IconPositionState {
  googleIconPosition: IconPosition | null;
}

const initialState: IconPositionState = {
  googleIconPosition: null,
};

export const iconPositionSlice = createSlice({
  name: "iconPosition",
  initialState,
  reducers: {
    setGoogleIconPosition: (
      state,
      action: PayloadAction<IconPosition>
    ) => {
      state.googleIconPosition = action.payload;
    },
    clearGoogleIconPosition: (state) => {
      state.googleIconPosition = null;
    },
  },
});

export const { setGoogleIconPosition, clearGoogleIconPosition } =
  iconPositionSlice.actions;
export default iconPositionSlice.reducer;

