import { Middleware } from "@reduxjs/toolkit";
import type { ContentRootState } from "../store.js";

// Actions that are allowed to update locally (from background)
const ALLOWED_ACTIONS = ["@@storeUpdate/updateStore"];

// Actions that should be synced to background (blocked locally)
const SYNC_ACTIONS = [
  "config/setConfig",
  "iconPosition/setGoogleIconPosition",
  "iconPosition/clearGoogleIconPosition",
];

export const createSyncMiddleware = (): Middleware<{}, ContentRootState> => {
  return (store) => (next) => (action: any) => {
    const actionType = action?.type || "";

    // Allow STORE_UPDATE actions (these come from background)
    if (ALLOWED_ACTIONS.includes(actionType)) {
      return next(action);
    }

    // Block sync actions and send to background instead
    if (SYNC_ACTIONS.includes(actionType)) {
      // Send to background
      chrome.runtime
        .sendMessage({
          type: "STORE_UPDATE",
          action: action,
          timestamp: Date.now(),
        })
        .catch((error) => {
          console.error("Error sending store update to background:", error);
        });

      console.log(
        "ContentSyncMiddleware: Sending store update to background:",
        action
      );

      // Don't apply the action locally - wait for background to send it back
      return action;
    }

    // Allow other actions (like iconPosition listener actions)
    return next(action);
  };
};
