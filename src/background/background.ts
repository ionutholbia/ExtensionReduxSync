// Service Worker (Background Script)
import { config, ContentScriptConfig, AppConfig } from "./config.js";
import { createAdoptStore } from "./store/store.js";
import {
  addWatchedApp,
  removeWatchedApp,
  updateStoreContent,
} from "./webApps/index.js";

const injectionConfig = config;

// Initialize the store
const store = createAdoptStore();

// Listen for extension installation or startup
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed, setting up content script injection");
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension startup, setting up content script injection");
});

// Inject script when a tab is updated
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // Handle content scripts
    for (const scriptConfig of injectionConfig.contentScripts) {
      if (matchesPattern(tab.url!, scriptConfig.matches)) {
        try {
          await injectScript(tabId, scriptConfig);
        } catch (error) {
          console.error("Error injecting script on tab update:", error);
        }
      }
    }

    // Handle apps - add to store when matched
    for (const appConfig of injectionConfig.apps) {
      if (matchesPattern(tab.url!, appConfig.matches)) {
        try {
          await injectScript(tabId, appConfig);
          // Add to store as WebAppState
          store.dispatch(
            addWatchedApp({
              tabId,
              appId: appConfig.appId,
              url: tab.url!,
            })
          );
          console.log(`Added app ${appConfig.appId} to store for tab ${tabId}`);
        } catch (error) {
          console.error("Error injecting app script on tab update:", error);
        }
      }
    }
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  store.dispatch(removeWatchedApp({ tabId }));
  console.log(`Removed app state for tab ${tabId}`);
});

// Helper function to inject a script
async function injectScript(
  tabId: number,
  scriptConfig: ContentScriptConfig | AppConfig
): Promise<void> {
  try {
    // Check if script is already injected (optional optimization)
    try {
      const results = await chrome.scripting.executeScript({
        target: { tabId },
        func: () => {
          return (window as any).__contentScriptInjected === true;
        },
      });

      if (results[0]?.result) {
        return; // Already injected
      }
    } catch (e) {
      // Continue if check fails
    }

    // Inject each JS file
    for (const jsFile of scriptConfig.js) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [jsFile],
      });
    }
  } catch (error) {
    // Script might already be injected or tab might be invalid
    console.log("Script injection note:", error);
  }
}

// Helper function to check if URL matches pattern
function matchesPattern(url: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (pattern === "<all_urls>") {
      return true;
    }
    // Simple pattern matching (can be enhanced)
    if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*"));
      if (regex.test(url)) {
        return true;
      }
    } else if (url.startsWith(pattern)) {
      return true;
    }
  }
  return false;
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "hello") {
    console.log("Received hello from content script:", sender.tab?.url);
    // Send config in response
    sendResponse({
      success: true,
      message: "Hello received!",
      config: injectionConfig,
    });
    return true; // Keep channel open for async response
  }

  if (message.type === "STORE_UPDATE") {
    const tabId = sender.tab?.id;
    if (!tabId) {
      sendResponse({ success: false, error: "No tab ID" });
      return true;
    }

    // Get the appId for this tab from the store
    const state = store.getState();
    const webAppState = state.webApp[tabId];

    if (!webAppState) {
      sendResponse({ success: false, error: "No web app found for tab" });
      return true;
    }

    // Find the appId (there should be one watched app per tab)
    const appIds = Object.keys(webAppState.watchedApps);
    if (appIds.length === 0) {
      sendResponse({ success: false, error: "No app found for tab" });
      return true;
    }

    const appId = appIds[0];
    const action = message.action;

    // Apply the action to get the new state
    // We need to get current storeContent, apply action, then update
    const currentStoreContent = webAppState.watchedApps[appId].storeContent;

    // Create a temporary reducer to apply the action
    // For now, we'll update based on action type
    let newStoreContent = { ...currentStoreContent };

    if (action.type === "config/setConfig") {
      newStoreContent = {
        ...newStoreContent,
        config: { config: action.payload },
      };
    } else if (action.type === "iconPosition/setGoogleIconPosition") {
      newStoreContent = {
        ...newStoreContent,
        iconPosition: { googleIconPosition: action.payload },
      };
    } else if (action.type === "iconPosition/clearGoogleIconPosition") {
      newStoreContent = {
        ...newStoreContent,
        iconPosition: { googleIconPosition: null },
      };
    }

    // Update the background store
    // The listener middleware will automatically send the update to content script
    store.dispatch(
      updateStoreContent({
        tabId,
        appId,
        storeContent: newStoreContent,
      })
    );

    sendResponse({ success: true });
    return true;
  }
});
