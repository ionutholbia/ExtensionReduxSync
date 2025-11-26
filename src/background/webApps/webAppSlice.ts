import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ContentStoreState {
  config: {
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
  };
  iconPosition: {
    googleIconPosition: {
      x: number;
      y: number;
      width: number;
      height: number;
    } | null;
  };
}

export interface WebAppState {
  [tabId: number]: {
    watchedApps: Record<
      string,
      { appId: string; url: string; storeContent: ContentStoreState }
    >;
  };
}

const initialState: WebAppState = {};

export const webAppSlice = createSlice({
  name: "webApp",
  initialState,
  reducers: {
    addWatchedApp: (
      state,
      action: PayloadAction<{
        tabId: number;
        appId: string;
        url: string;
        storeContent?: ContentStoreState;
      }>
    ) => {
      const { tabId, appId, url, storeContent } = action.payload;
      if (!state[tabId]) {
        state[tabId] = { watchedApps: {} };
      }
      state[tabId].watchedApps[appId] = {
        appId,
        url,
        storeContent: storeContent || {
          config: { config: null },
          iconPosition: { googleIconPosition: null },
        },
      };
    },
    removeWatchedApp: (state, action: PayloadAction<{ tabId: number }>) => {
      const { tabId } = action.payload;
      delete state[tabId];
    },
    updateStoreContent: (
      state,
      action: PayloadAction<{
        tabId: number;
        appId: string;
        storeContent: ContentStoreState;
      }>
    ) => {
      const { tabId, appId, storeContent } = action.payload;
      if (state[tabId]?.watchedApps[appId]) {
        state[tabId].watchedApps[appId].storeContent = storeContent;
      }
    },
  },
});

// Export actions
export const { addWatchedApp, removeWatchedApp, updateStoreContent } =
  webAppSlice.actions;

// Export reducer
export default webAppSlice.reducer;
