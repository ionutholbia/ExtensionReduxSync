import type { ContentStore } from "../store.js";
import { updateStore } from "../reducers/storeUpdateReducer.js";

export const setupReceiveMiddleware = (store: ContentStore) => {
  // Listen for messages from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "STORE_UPDATE") {
      // Apply the state update from background
      const stateUpdate = message.state;

      console.log("Received store update from background:", stateUpdate);
      // Dispatch the update action
      store.dispatch(updateStore(stateUpdate));

      sendResponse({ success: true });
      return true;
    }
  });
};
