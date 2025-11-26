import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TabsRootState {
  tabs: Record<string, unknown>;
}

const initialState: TabsRootState = {
  tabs: {},
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    createTab: (state, action: PayloadAction<{ tabId: string }>) => {
      const { tabId } = action.payload;
      if (!state.tabs[tabId]) {
        state.tabs[tabId] = { watchedApps: {} };
      }
    },
    removeTab: (state, action: PayloadAction<{ tabId: string }>) => {
      delete state.tabs[action.payload.tabId];
    },
  },
});

export const { createTab, removeTab } = tabsSlice.actions;
export default tabsSlice.reducer;

