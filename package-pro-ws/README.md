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

## Links

- Website: [rte.whitneys.co](https://rte.whitneys.co)
- GitHub: [github.com/MIR-2025/rte](https://github.com/MIR-2025/rte)
- RTEPro (editor only): [rte-rich-text-editor-pro](https://www.npmjs.com/package/rte-rich-text-editor-pro)
- RTE (base editor): [rte-rich-text-editor](https://www.npmjs.com/package/rte-rich-text-editor)
