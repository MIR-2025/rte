# RTE-WS — WebSocket Connector for RTE Rich Text Editor

Add real-time auto-save and multi-user collaboration to [RTE](https://www.npmjs.com/package/rte-rich-text-editor) with a single script tag. **Zero dependencies.**

![RTE Rich Text Editor](https://rte.whitneys.co/rte.png)

## Install

### npm

```bash
npm install rte-rich-text-editor-ws
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

## Documentation

Full documentation with more backend examples at [rte.whitneys.co/websocket](https://rte.whitneys.co/websocket)

## License

MIT
