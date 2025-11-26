# ReduxSync - Chrome/Edge Extension

**Proof of Concept (POC)** for synchronizing Redux stores between content scripts and background scripts in a Chrome/Edge extension.

This extension demonstrates a master-slave pattern where:
- **Background script** maintains the source of truth for all Redux store state
- **Content scripts** have local Redux stores that are synchronized with the background store
- Content scripts cannot directly update their stores - all updates must go through the background script
- The background script mirrors the content store state and automatically syncs updates back to content scripts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

This will compile TypeScript files and copy necessary files to the `dist` directory.

## Installation

### Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right)
3. Click "Load unpacked"
4. Select the `dist` directory (not the root directory)

### Edge
1. Open Edge and navigate to `edge://extensions/`
2. Enable "Developer mode" (toggle in the bottom left)
3. Click "Load unpacked"
4. Select the `dist` directory (not the root directory)

## Features

- **Redux Store Synchronization**: Master-slave pattern with background script as source of truth
- **Content Script Store**: Local Redux store in content scripts that syncs with background
- **Background Script Store**: Centralized Redux store that mirrors all content script stores
- **Middleware-based Sync**: RTK middleware blocks direct content store updates and routes through background
- **Automatic Updates**: Background automatically syncs store updates back to content scripts
- **Service worker injection**: Programmatically injects content scripts based on configuration
- **TypeScript**: Fully typed with TypeScript and Redux Toolkit
- **Feature-based structure**: Organized by features (config, iconPosition, webApps, tabs)

## Project Structure

```
├── src/
│   ├── background/
│   │   ├── background.ts         # Service worker that injects content scripts
│   │   ├── config.ts             # Configuration for script injection
│   │   ├── store/                # Background Redux store
│   │   ├── tabs/                 # Tab management feature
│   │   └── webApps/              # WebApp feature with store mirroring
│   ├── content/
│   │   ├── content.ts            # Content script entry point
│   │   ├── config/               # Config feature slice
│   │   ├── iconPosition/         # Icon position feature slice
│   │   └── store/                # Content Redux store with sync middleware
│   └── shared/
│       └── middleware/           # Shared logger middleware
├── dist/                         # Compiled output (generated)
├── manifest.json                 # Extension manifest
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and build scripts
```

## Customization

- Edit `src/background/config.ts` to change which URLs get the content script injected
- Edit `src/content/content.ts` to modify what the content script does
- Edit `src/background/background.ts` to change injection logic

## Development

- `npm run build` - Build the extension
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run clean` - Remove the dist directory

