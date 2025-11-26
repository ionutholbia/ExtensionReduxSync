# Chrome/Edge Extension - Content Script

A Chrome/Edge extension that uses a service worker to programmatically inject content scripts based on a hardcoded JSON configuration.

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

- Service worker programmatically injects content scripts (not via manifest)
- Configuration defined in `src/config.ts` (hardcoded JSON-like structure)
- Content script communicates with service worker and sends "hello" message
- TypeScript source files in `src` directory
- Visual indicator when content script is active

## Project Structure

```
├── src/
│   ├── background/
│   │   ├── background.ts    # Service worker that injects content scripts
│   │   └── config.ts        # Configuration for script injection
│   └── content/
│       └── content.ts       # Content script that runs on web pages
├── dist/                    # Compiled output (generated)
├── manifest.json            # Extension manifest
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and build scripts
```

## Customization

- Edit `src/background/config.ts` to change which URLs get the content script injected
- Edit `src/content/content.ts` to modify what the content script does
- Edit `src/background/background.ts` to change injection logic

## Development

- `npm run build` - Build the extension
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run clean` - Remove the dist directory

