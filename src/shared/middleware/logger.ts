import { Middleware } from "@reduxjs/toolkit";

// Generic logger middleware that works with any Redux state
export const createLoggerMiddleware = <State = any>(): Middleware<{}, State> =>
  (store) => (next) => (action: any) => {
    const prevState = store.getState();
    const result = next(action);
    const nextState = store.getState();

    const changedPaths = getChangedPaths(prevState, nextState);

    // Format timestamp
    const timestamp = new Date().toLocaleTimeString();

    // Console styling
    const styles = {
      action: "color: #9C27B0; font-weight: bold; font-size: 11px;",
      timestamp: "color: #666; font-size: 10px;",
      prev: "color: #F44336; font-weight: bold;",
      next: "color: #4CAF50; font-weight: bold;",
      changed: "color: #FF9800; font-weight: bold;",
      label: "color: #2196F3; font-weight: bold;",
    };

    const actionType = action?.type || "UNKNOWN";

    console.group(
      `%c🔔 Redux Action%c %c${actionType}%c @ %c${timestamp}`,
      styles.label,
      "",
      styles.action,
      "",
      styles.timestamp
    );

    // Show action payload
    if (
      action?.payload &&
      typeof action.payload === "object" &&
      Object.keys(action.payload).length > 0
    ) {
      console.log("%c📦 Payload:", styles.label, action.payload);
    }

    // Show what changed
    if (changedPaths.length > 0) {
      console.log(
        `%c📊 Changed paths (${changedPaths.length}):`,
        styles.changed,
        changedPaths
      );
    }

    // Show previous and next state (only changed slices)
    const changedSlices = new Set(
      changedPaths.map((path) => path.split(".")[0])
    );

    changedSlices.forEach((slice) => {
      console.group(`%c📦 ${slice} slice`, styles.label);
      console.log(
        "%c⬅️  Previous:",
        styles.prev,
        (prevState as any)[slice]
      );
      console.log("%c➡️  Next:", styles.next, (nextState as any)[slice]);
      console.groupEnd();
    });

    // Show full state (collapsed)
    console.groupCollapsed("%c🗂️  Full State", styles.label);
    console.log(prevState);
    console.groupEnd();

    console.groupEnd();

    return result;
  };

// Helper to get changed paths in nested objects
function getChangedPaths(
  prev: any,
  next: any,
  path: string = ""
): string[] {
  const changes: string[] = [];

  if (prev === next) return changes;

  if (prev == null || next == null) {
    changes.push(path || "root");
    return changes;
  }

  if (typeof prev !== "object" || typeof next !== "object") {
    changes.push(path || "root");
    return changes;
  }

  const allKeys = new Set([...Object.keys(prev), ...Object.keys(next)]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;

    if (!(key in prev)) {
      changes.push(newPath);
    } else if (!(key in next)) {
      changes.push(newPath);
    } else if (prev[key] !== next[key]) {
      if (
        typeof prev[key] === "object" &&
        typeof next[key] === "object" &&
        prev[key] !== null &&
        next[key] !== null
      ) {
        changes.push(...getChangedPaths(prev[key], next[key], newPath));
      } else {
        changes.push(newPath);
      }
    }
  }

  return changes;
}

