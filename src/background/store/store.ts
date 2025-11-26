import { configureStore, ListenerMiddlewareInstance } from "@reduxjs/toolkit";

import { tabsReducer } from "../tabs/index.js";
import {
  webAppReducer,
  createBackgroundSyncMiddleware,
} from "../webApps/index.js";
import { createLoggerMiddleware } from "../../shared/middleware/logger.js";

export const createAdoptStore = (
  additionalMiddlewares: ListenerMiddlewareInstance[] = []
) =>
  configureStore({
    reducer: {
      tabs: tabsReducer,
      webApp: webAppReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(
        createLoggerMiddleware(),
        createBackgroundSyncMiddleware(),
        ...additionalMiddlewares.map((m) => m.middleware)
      ),
  });

export type AdoptStore = ReturnType<typeof createAdoptStore>;
export type RootState = {
  tabs: ReturnType<typeof tabsReducer>;
  webApp: ReturnType<typeof webAppReducer>;
};
export type AppDispatch = AdoptStore["dispatch"];
