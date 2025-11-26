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
      console.log("Listener: Google icon position update in store.", position);
    } catch (error) {
      console.error(
        "Listener: Error sending icon position to background:",
        error
      );
    }
  },
});
