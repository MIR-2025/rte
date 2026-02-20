# RTEPro + WebSocket Bundle

RTEPro full-featured WYSIWYG editor + WebSocket connector in a single file. AI integration, real-time collaboration, auto-save. Zero dependencies.

![RTEPro Editor](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro-1.png)

![RTEPro Screenshot](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro.png)

![RTEPro Find & Replace](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro-fr.png)

## Install

```bash
npm install rte-rich-text-editor-pro-ws
```

Or via CDN:

```html
<script src="https://unpkg.com/rte-rich-text-editor-pro-ws/rte-pro-ws.js"></script>
```

## Quick Start

```html
<div id="editor"></div>
<script src="rte-pro-ws.js"></script>
<script>
  const editor = RTEPro.init('#editor', {
    placeholder: 'Start typing...',
    height: '400px',
    aiProxy: '/api/ai',  // recommended — see AI Integration below
  });

  const ws = RTEProWS.connect(editor, 'wss://yourserver.com/ws', {
    docId: 'doc-123',
    userId: 'user-abc',
  });
</script>
```

## What's Included

This bundle combines two libraries into one file:

- **RTEPro** — Full-featured WYSIWYG editor with AI, 16 toolbar groups, slash commands, mentions, version history
- **RTEProWS** — WebSocket connector for real-time collaboration and auto-save

## RTEProWS Options

| Option | Type | Default | Description |
|---|---|---|---|
| `docId` | string | `null` | Document identifier |
| `userId` | string | `null` | Current user identifier |
| `debounceMs` | number | `1000` | Debounce interval for auto-save |
| `reconnect` | boolean | `true` | Auto-reconnect on disconnect |
| `reconnectMaxMs` | number | `30000` | Max reconnect delay |
| `reconnectBaseMs` | number | `1000` | Initial reconnect delay |
| `heartbeatMs` | number | `30000` | Heartbeat ping interval |
| `autoSave` | boolean | `true` | Auto-save content on changes |
| `onOpen` | function | `null` | WebSocket open callback |
| `onClose` | function | `null` | WebSocket close callback |
| `onError` | function | `null` | Error callback |
| `onSaved` | function | `null` | Server confirmed save |
| `onRemoteUpdate` | function | `null` | Remote user change received |
| `onMessage` | function | `null` | Any incoming message |

## RTEProWS API

```js
ws.save()        // Send explicit save request
ws.send(data)    // Send custom message
ws.disconnect()  // Close connection, stop reconnecting
ws.reconnect()   // Reconnect manually
ws.state         // "connecting" | "open" | "closing" | "closed"
ws.socket        // Raw WebSocket instance
```

## Backend Protocol

### Incoming Messages (server → client)

```json
{ "type": "load",   "html": "<p>...</p>" }
{ "type": "update", "html": "<p>...</p>", "userId": "..." }
{ "type": "saved",  "version": 5 }
{ "type": "error",  "message": "..." }
```

### Outgoing Messages (client → server)

```json
{ "type": "join",   "docId": "...", "userId": "..." }
{ "type": "change", "docId": "...", "userId": "...", "html": "...", "text": "...", "words": 42, "chars": 256 }
{ "type": "save",   "docId": "...", "userId": "...", "html": "...", "text": "...", "words": 42, "chars": 256 }
{ "type": "ping" }
```

## AI Integration

> **Warning:** Never use `apiKey` in production web apps — it exposes your Anthropic API key in the browser where anyone can steal it. Use `aiProxy` to route requests through your own server, which keeps the key secret.

**Recommended: Server-side proxy (keeps your key safe)**

```js
const editor = RTEPro.init('#editor', {
  aiProxy: '/api/ai',  // your server endpoint that forwards to Anthropic
});
```

Your proxy endpoint receives the same JSON body the editor would send to Anthropic and should forward it to `https://api.anthropic.com/v1/messages` with your API key attached server-side. For streaming requests (`stream: true`), pipe the SSE response back; for non-streaming requests, return the JSON response.

**Direct API key (only for local dev / internal tools)**

```js
const editor = RTEPro.init('#editor', {
  apiKey: 'sk-ant-...',
});
```

## RTEPro Features

All features from [rte-rich-text-editor-pro](https://www.npmjs.com/package/rte-rich-text-editor-pro):

- 16 toolbar groups, AI panel (Anthropic Claude), slash commands, @ mentions. **Ask AI Anything** lets you type any freeform instruction using the editor's current content as context — e.g. "Make this more formal", "Add bullet points", "Explain this in simpler terms".
- Find & Replace, source view, markdown toggle, fullscreen
- 50-state undo/redo, version history, auto-save
- Content analysis (readability, SEO, accessibility)
- Tables, footnotes, TOC, gridlines, drag & drop, focus mode
- 30+ API methods, TypeScript declarations, UMD, zero dependencies

## License

MIT — phpMyDEV, LLC

## Related Packages

| Package | Description |
|---|---|
| [rte-rich-text-editor](https://www.npmjs.com/package/rte-rich-text-editor) | Core editor — lightweight, 33 toolbar controls |
| [rte-rich-text-editor-ws](https://www.npmjs.com/package/rte-rich-text-editor-ws) | WebSocket connector for RTE |
| [rte-rich-text-editor-bundle](https://www.npmjs.com/package/rte-rich-text-editor-bundle) | RTE + WebSocket in one file |
| [rte-rich-text-editor-pro](https://www.npmjs.com/package/rte-rich-text-editor-pro) | Pro editor — 16 toolbar groups, AI, slash commands, mentions |
| [rte-rich-text-editor-pro-ws](https://www.npmjs.com/package/rte-rich-text-editor-pro-ws) | RTEPro + WebSocket in one file |
| [wskit-client](https://www.npmjs.com/package/wskit-client) | Universal WebSocket client |
| [websocket-toolkit](https://www.npmjs.com/package/websocket-toolkit) | Universal WebSocket client (alternate name) |

Website: [rte.whitneys.co](https://rte.whitneys.co) · GitHub: [MIR-2025/rte](https://github.com/MIR-2025/rte)

# Changelog

All notable changes to `rte-rich-text-editor-pro-ws` will be documented in this file.

## [1.0.9] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

## [1.0.8] - 2026-02-18
- Fixed HTML export stripping column layout classes (columns, page breaks, mentions now preserved)
- Fixed drag handle and column handle elements leaking into exports
- Added inline styles for email-compatible column exports (table-cell layout)
- Added cleanText() for drag-handle-free text exports

## [1.0.7] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed gradient text overwriting existing styles (now preserves bold, italic, etc.)
- Fixed columns not allowing new content below (added trailing paragraph)
- Added "Remove Columns" to right-click context menu
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

## [1.0.6] - 2026-02-18
- Added Find & Replace screenshot to README

## [1.0.5] - 2026-02-18
- Added filename input to export bar for custom export filenames

## [1.0.2] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.0] - 2026-02-17
- Initial release — RTEPro editor + WebSocket connector bundled in a single file
- Includes all RTEPro 1.0.3 features (16 toolbar groups, AI integration, slash commands, mentions, etc.)
- WebSocket connector (RTEProWS) with auto-save, real-time collaboration, auto-reconnect, heartbeat
- Single script tag, zero dependencies
