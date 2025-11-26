import type { ContentStore } from "../store.js";
import { updateStore } from "../reducers/storeUpdateReducer.js";

export const setupReceiveMiddleware = (store: ContentStore) => {
  // Listen for messages from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "STORE_SYNC") {
      // Apply the state update from background
      const stateUpdate = message.state;

      console.log(
        "ContentReceiveMiddleware: Received store sync from background:",
        stateUpdate
      );
      // Dispatch the update action
      store.dispatch(updateStore(stateUpdate));

      sendResponse({ success: true });
      return true;
    }
  });
};
