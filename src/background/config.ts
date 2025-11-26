// Configuration for content script injection
export interface ContentScriptConfig {
  matches: string[];
  js: string[];
  runAt: "document_idle" | "document_start" | "document_end";
}

export interface AppConfig {
  appId: string;
  matches: string[];
  js: string[];
  runAt: "document_idle" | "document_start" | "document_end";
}

export interface Config {
  contentScripts: ContentScriptConfig[];
  apps: AppConfig[];
}

export const config: Config = {
  contentScripts: [
    {
      matches: ["*://*.google.com/*", "*://google.com/*"],
      js: ["content/content.js"],
      runAt: "document_idle",
    },
  ],
  apps: [
    {
      appId: "google",
      matches: ["*://*.google.com/*", "*://google.com/*"],
      js: ["content/content.js"],
      runAt: "document_idle",
    },
  ],
};
