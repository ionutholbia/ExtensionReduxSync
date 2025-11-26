import { Middleware } from "@reduxjs/toolkit";
import { updateStoreContent } from "../webAppSlice.js";
import type { RootState } from "../../store/store.js";

export const createBackgroundSyncMiddleware = (): Middleware<{}, RootState> => {
  return (store) => (next) => (action: any) => {
    // Let the action pass through (don't block)
    const result = next(action);

    // If this is a store content update, send to content script
    if (action.type === updateStoreContent.type) {
      const { tabId, storeContent } = action.payload;

      // Send the updated state to the content script
      chrome.tabs
        .sendMessage(tabId, {
          type: "STORE_SYNC",
          state: storeContent,
        })
        .then(() => {
          console.log(
            `BackgroundSyncMiddleware: Store update sent to content script for tab ${tabId}`
          );
        })
        .catch((error) => {
          console.error(
            `Error sending store update to content script for tab ${tabId}:`,
            error
          );
        });
    }

    return result;
  };
};
