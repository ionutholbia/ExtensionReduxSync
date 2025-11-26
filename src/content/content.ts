// Content Script
import { createContentStore } from "./store/store.js";
import { setConfig } from "./config/index.js";
import { setGoogleIconPosition } from "./iconPosition/index.js";

console.log("Content script loaded!");

// Initialize the store with error handling
let store: ReturnType<typeof createContentStore>;
try {
  store = createContentStore();
  console.log("Content store initialized successfully");
} catch (error) {
  console.error("Error initializing content store:", error);
  // Create a minimal store-like object to prevent further errors
  store = {
    dispatch: () => {},
    getState: () => ({
      config: { config: null },
      iconPosition: { googleIconPosition: null },
    }),
    subscribe: () => () => {},
    replaceReducer: () => {},
  } as any;
}

// Find Google icon position
function findGoogleIconPosition(): {
  x: number;
  y: number;
  width: number;
  height: number;
} | null {
  // Try to find the Google logo/icon on the page
  // Common selectors for Google logo
  const selectors = [
    'svg[aria-label="Google"]', // Google SVG logo
    'svg[role="img"][aria-label="Google"]', // More specific SVG selector
    "svg.lnXdpd", // Google logo SVG class
    'img[alt="Google"]',
    'img[alt*="Google"]',
    "#logo img",
    "#logo svg",
    ".logo img",
    ".logo svg",
    '[data-atf="1"] img', // Google search page logo
    '[data-atf="1"] svg', // Google search page SVG logo
    'img[src*="googlelogo"]',
  ];

  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      const rect = element.getBoundingClientRect();
      // Only return if element is visible
      if (rect.width > 0 && rect.height > 0) {
        return {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        };
      }
    }
  }

  return null;
}

// Save Google icon position to store
function saveGoogleIconPosition() {
  const position = findGoogleIconPosition();
  if (position) {
    store.dispatch(setGoogleIconPosition(position));
  } else {
  }
}

// Send hello message to service worker
async function sendHelloToServiceWorker() {
  try {
    const state = store.getState();
    const config = state.config;

    const response = await chrome.runtime.sendMessage({
      type: "hello",
      timestamp: Date.now(),
      config: config, // Send config from store
    });

    console.log("Content initialization:", response);

    // Save config to store if received from background
    if (response?.config) {
      store.dispatch(setConfig(response.config));
    }
  } catch (error) {
    console.error("Error sending message to service worker:", error);
  }
}

// Initialize when DOM is ready
function initialize() {
  // Send hello message
  sendHelloToServiceWorker();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Watch for DOM changes to catch dynamically loaded icons
const observer = new MutationObserver(() => {
  saveGoogleIconPosition();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Mark as injected
(window as any).__contentScriptInjected = true;
