# RTE-WS — WebSocket Connector for RTE Rich Text Editor

Add real-time auto-save and multi-user collaboration to [RTE](https://www.npmjs.com/package/rte-rich-text-editor) with a single script tag. **Zero dependencies.**

![RTE Rich Text Editor](https://rte.whitneys.co/rte.png)

## Install

### npm

```bash
npm install rte-rich-text-editor-ws
```

### CommonJS

```js
const RTE = require('rte-rich-text-editor');
const RTEWS = require('rte-rich-text-editor-ws');
```

### ES Modules

```js
import RTE from 'rte-rich-text-editor';
import RTEWS from 'rte-rich-text-editor-ws';
```

### Script Tag

```html
<script src="https://rte.whitneys.co/rte.js"></script>
<script src="https://rte.whitneys.co/rte-ws.js"></script>
```

## Quick Start

```html
<div id="editor"></div>

<script src="https://rte.whitneys.co/rte.js"></script>
<script src="https://rte.whitneys.co/rte-ws.js"></script>
<script>
  const editor = RTE.init('#editor');

  const ws = RTEWS.connect(editor, 'wss://yourserver.com/ws', {
    docId: 'doc-123',
    userId: 'user-abc',
    onOpen: () => console.log('Connected'),
    onSaved: (msg) => console.log('Saved, version:', msg.version),
    onRemoteUpdate: (msg) => console.log('Update from:', msg.userId),
  });
</script>
```

### CommonJS

```js
const RTE = require('rte-rich-text-editor');
const RTEWS = require('rte-rich-text-editor-ws');

const editor = RTE.init('#editor');
const ws = RTEWS.connect(editor, 'wss://yourserver.com/ws', { docId: 'doc-1', userId: 'user-1' });
```

## Features

| Feature | Description |
|---|---|
| **Auto-Save** | Debounced content sync to backend on every change |
| **Collaboration** | Broadcast and receive changes between multiple users |
| **Auto-Reconnect** | Exponential backoff (1s → 2s → 4s → ... up to 30s) |
| **Heartbeat** | Configurable keep-alive ping (default 30s) |
| **Cursor Preservation** | Local cursor position saved/restored on remote updates |

## Configuration

```js
const ws = RTEWS.connect(editor, 'wss://yourserver.com/ws', {
  docId: 'doc-123',         // Document identifier
  userId: 'user-abc',       // User identifier
  debounceMs: 1000,         // Debounce delay before sending changes
  autoSave: true,           // Auto-send changes on editor input
  reconnect: true,          // Auto-reconnect on disconnect
  reconnectBaseMs: 1000,    // Initial reconnect delay
  reconnectMaxMs: 30000,    // Max reconnect delay
  heartbeatMs: 30000,       // Ping interval (0 to disable)
  onOpen: (ws) => {},       // WebSocket connected
  onClose: (e) => {},       // WebSocket closed
  onError: (e) => {},       // Error occurred
  onSaved: (msg) => {},     // Server confirmed save
  onRemoteUpdate: (msg) => {}, // Remote user change applied
  onMessage: (msg) => {},   // Any incoming message
});
```

## API

| Method / Property | Description |
|---|---|
| `ws.save()` | Send explicit save request |
| `ws.send(data)` | Send custom JSON message |
| `ws.disconnect()` | Close connection, stop reconnecting |
| `ws.reconnect()` | Manually reconnect |
| `ws.state` | `"connecting"`, `"open"`, `"closing"`, or `"closed"` |
| `ws.socket` | Raw WebSocket instance |

## Message Protocol

### Outgoing (Client → Server)

| Type | Fields | Description |
|---|---|---|
| `"join"` | `docId`, `userId` | Sent on connect |
| `"change"` | `docId`, `userId`, `html`, `text`, `words`, `chars` | Editor content changed |
| `"save"` | `docId`, `userId`, `html`, `text`, `words`, `chars` | Explicit save |
| `"ping"` | — | Heartbeat |

### Incoming (Server → Client)

| Type | Fields | Description |
|---|---|---|
| `"load"` | `html` | Load initial content |
| `"update"` | `html`, `userId` | Remote user change |
| `"saved"` | `version` (optional) | Save confirmed |
| `"error"` | `message` | Server error |

## Backend Example (Node.js)

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const docs = new Map();

wss.on('connection', (socket) => {
  let docId = null, userId = null;

  socket.on('message', (raw) => {
    const msg = JSON.parse(raw);

    if (msg.type === 'join') {
      docId = msg.docId; userId = msg.userId;
      if (!docs.has(docId)) docs.set(docId, { html: '', clients: new Set() });
      docs.get(docId).clients.add(socket);
      socket.send(JSON.stringify({ type: 'load', html: docs.get(docId).html }));
    }

    if (msg.type === 'change' && docId) {
      docs.get(docId).html = msg.html;
      docs.get(docId).clients.forEach(c => {
        if (c !== socket && c.readyState === 1)
          c.send(JSON.stringify({ type: 'update', html: msg.html, userId }));
      });
    }

    if (msg.type === 'save')
      socket.send(JSON.stringify({ type: 'saved', version: Date.now() }));
  });

  socket.on('close', () => {
    if (docId && docs.has(docId)) docs.get(docId).clients.delete(socket);
  });
});
```

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

## License

MIT

# Changelog

All notable changes to `rte-rich-text-editor-ws` will be documented in this file.

## [1.0.5] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

## [1.0.2] - 2026-02-16
- Added CommonJS and ES Modules usage examples to README

## [1.0.1] - 2026-02-16
- Added related package links to README

## [1.0.0] - 2026-02-16
- Initial release — standalone WebSocket connector for RTE
- Auto-save with configurable debounce
- Real-time collaboration with cursor preservation
- Auto-reconnect with exponential backoff
- Heartbeat keep-alive
- UMD wrapper (script tag, CommonJS, AMD)
