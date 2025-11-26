import { createListenerMiddleware } from "@reduxjs/toolkit";
import { updateStoreContent } from "./webAppSlice.js";
import type { RootState } from "../store/store.js";

// Create listener middleware for webApp store updates
export const webAppListenerMiddleware = createListenerMiddleware();

// Listen for store content updates and forward to content script
webAppListenerMiddleware.startListening({
  actionCreator: updateStoreContent,
  effect: async (action, listenerApi) => {
    const { tabId, storeContent } = action.payload;
    
    try {
      // Send the updated state to the content script
      await chrome.tabs.sendMessage(tabId, {
        type: "STORE_UPDATE",
        state: storeContent,
      });
      
      console.log(`Store update sent to content script for tab ${tabId}`);
    } catch (error) {
      console.error(
        `Error sending store update to content script for tab ${tabId}:`,
        error
      );
    }
  },
});

