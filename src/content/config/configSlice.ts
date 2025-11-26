import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ConfigState {
  config: {
    contentScripts: Array<{
      matches: string[];
      js: string[];
      runAt: string;
    }>;
    apps: Array<{
      appId: string;
      matches: string[];
      js: string[];
      runAt: string;
    }>;
  } | null;
}

const initialState: ConfigState = {
  config: null,
};

export const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (
      state,
      action: PayloadAction<ConfigState["config"]>
    ) => {
      state.config = action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;

