# RTEPro + WebSocket Bundle

RTEPro full-featured WYSIWYG editor + WebSocket connector in a single file. AI integration, real-time collaboration, auto-save. Zero dependencies.

![RTEPro Screenshot](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro.png)

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
    apiKey: 'sk-ant-...',
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

## RTEPro Features

All features from [rte-rich-text-editor-pro](https://www.npmjs.com/package/rte-rich-text-editor-pro):

- 16 toolbar groups, AI panel (Anthropic Claude), slash commands, @ mentions
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
