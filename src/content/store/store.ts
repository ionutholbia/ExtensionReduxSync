import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { configReducer } from "../config/index.js";
import {
  iconPositionReducer,
  iconPositionListenerMiddleware,
} from "../iconPosition/index.js";
import { createLoggerMiddleware } from "../../shared/middleware/logger.js";
import { createSyncMiddleware } from "./middleware/syncMiddleware.js";
import { setupReceiveMiddleware } from "./middleware/receiveMiddleware.js";
import { storeUpdateSlice } from "./reducers/storeUpdateReducer.js";

const rootReducer = combineReducers({
  config: configReducer,
  iconPosition: iconPositionReducer,
});

// Define state type
export type ContentRootState = {
  config: ReturnType<typeof configReducer>;
  iconPosition: ReturnType<typeof iconPositionReducer>;
};

// Override reducer to handle store updates
const reducer = (
  state: ContentRootState | undefined,
  action: any
): ContentRootState => {
  if (action.type === storeUpdateSlice.actions.updateStore.type) {
    return action.payload;
  }
  return rootReducer(state, action) as ContentRootState;
};

export const createContentStore = () => {
  const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      })
        .prepend(createLoggerMiddleware())
        .prepend(createSyncMiddleware())
        .prepend(iconPositionListenerMiddleware.middleware),
  });

  // Setup message listener for receiving updates from background
  setupReceiveMiddleware(store);

  return store;
};

export type ContentStore = ReturnType<typeof createContentStore>;
export type ContentDispatch = ContentStore["dispatch"];
