import { createListenerMiddleware } from "@reduxjs/toolkit";
import { setGoogleIconPosition } from "./iconPositionSlice.js";
import type { IconPosition } from "./iconPositionSlice.js";

// Create listener middleware for icon position
export const iconPositionListenerMiddleware = createListenerMiddleware();

// Listen for Google icon position updates
iconPositionListenerMiddleware.startListening({
  actionCreator: setGoogleIconPosition,
  effect: async (action, listenerApi) => {
    const position: IconPosition = action.payload;

    try {
      // Send message to background with the icon position
      await chrome.runtime.sendMessage({
        type: "googleIconPosition",
        position: position,
        timestamp: Date.now(),
      });

      console.log("Google icon position sent to background:", position);
    } catch (error) {
      console.error("Error sending icon position to background:", error);
    }
  },
});
