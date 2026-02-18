# WSKit — Universal WebSocket Client

A standalone, universal WebSocket client that works with any backend. **One script tag. Zero dependencies.**

## Install

### npm

```bash
npm install wskit-client
```

### CommonJS

```js
const WSKit = require('wskit-client');
```

### ES Modules

```js
import WSKit from 'wskit-client';
```

### Script Tag

```html
<script src="https://unpkg.com/wskit-client/wskit.js"></script>
```

## Quick Start

```js
const ws = WSKit.connect('wss://yourserver.com/ws', {
  onOpen: () => console.log('Connected'),
  onMessage: (msg) => console.log('Received:', msg),
});

ws.send({ type: 'chat', text: 'Hello!' });
```

## Features

| Feature | Description |
|---|---|
| **Auto-Reconnect** | Exponential backoff (1s → 2s → 4s → ... up to 30s) |
| **Message Queue** | Buffers sends while disconnected, flushes on reconnect |
| **Channels** | Subscribe to message types: `ws.on('chat', handler)` |
| **Request/Response** | `ws.request(data)` returns a Promise |
| **Heartbeat** | Configurable keep-alive ping |
| **Auto-JSON** | Auto parse/stringify JSON messages |
| **Debug Mode** | `debug: true` for verbose console logging |
| **TypeScript** | Full type declarations included |

## Channels

Route messages by type:

```js
// Subscribe — returns an unsubscribe function
const off = ws.on('chat', (msg) => {
  console.log(msg.user + ':', msg.text);
});

// Unsubscribe
off();

// Or unsubscribe by type
ws.off('chat');
```

Messages are routed by the `type` field by default (configurable via `typeField`).

## Request/Response

Send a message and wait for a matching response:

```js
const user = await ws.request({ type: 'getUser', id: 123 });
console.log(user.name);
```

The server should include the same `_id` field in its response. The `_id` is auto-generated and matched.

```js
// Server-side example (Node.js)
socket.on('message', (raw) => {
  const msg = JSON.parse(raw);
  if (msg.type === 'getUser') {
    socket.send(JSON.stringify({
      _id: msg._id,  // echo back the _id
      name: 'John',
      email: 'john@example.com',
    }));
  }
});
```

## Message Queue

Messages sent while disconnected are buffered and flushed on reconnect:

```js
const ws = WSKit.connect(url, {
  queueWhileDisconnected: true,  // default
  maxQueueSize: 100,             // default
});

// These will be queued if not connected yet
ws.send({ type: 'init', token: 'abc' });
ws.send({ type: 'subscribe', channel: 'updates' });

// Check queue
console.log(ws.queueSize); // 2

// Clear queue if needed
ws.clearQueue();
```

## Configuration

```js
const ws = WSKit.connect('wss://yourserver.com/ws', {
  // Reconnection
  reconnect: true,              // auto-reconnect (default: true)
  reconnectBaseMs: 1000,        // initial delay (default: 1000)
  reconnectMaxMs: 30000,        // max delay (default: 30000)
  maxReconnectAttempts: 0,      // 0 = unlimited (default: 0)

  // Heartbeat
  heartbeatMs: 30000,           // ping interval (default: 30000)
  heartbeatMessage: { type: 'ping' },

  // Message queue
  queueWhileDisconnected: true, // buffer sends (default: true)
  maxQueueSize: 100,            // max queue size (default: 100)

  // JSON
  autoJSON: true,               // auto parse/stringify (default: true)
  typeField: 'type',            // channel routing field (default: 'type')

  // Request/response
  requestTimeout: 10000,        // timeout in ms (default: 10000)
  idField: '_id',               // matching field (default: '_id')

  // Debug
  debug: false,                 // console logging (default: false)

  // Callbacks
  onOpen: () => {},
  onClose: (e) => {},
  onError: (e) => {},
  onMessage: (data) => {},
  onReconnect: (attempt) => {},
  onStateChange: (newState, prevState) => {},
});
```

## API

| Method / Property | Description |
|---|---|
| `ws.send(data)` | Send data (auto-JSON if enabled). Returns `true` if sent, `false` if queued. |
| `ws.request(data, timeout?)` | Send and wait for matching response. Returns `Promise`. |
| `ws.on(type, handler)` | Subscribe to message type. Returns unsubscribe function. |
| `ws.off(type, handler?)` | Unsubscribe. Omit handler to remove all for that type. |
| `ws.disconnect()` | Close connection and stop reconnecting. |
| `ws.reconnect()` | Manually reconnect. |
| `ws.clearQueue()` | Clear the message queue. |
| `ws.state` | `"connecting"`, `"open"`, `"closed"`, or `"reconnecting"` |
| `ws.queueSize` | Number of queued messages |
| `ws.socket` | Raw `WebSocket` instance |
| `ws.url` | The WebSocket URL |
| `ws.reconnectAttempts` | Current reconnect attempt count |

## Backend Example (Node.js)

```js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (socket) => {
  socket.on('message', (raw) => {
    const msg = JSON.parse(raw);

    switch (msg.type) {
      case 'chat':
        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify(msg));
          }
        });
        break;

      case 'getUser':
        // Request/response — echo back _id
        socket.send(JSON.stringify({
          _id: msg._id,
          name: 'John',
          email: 'john@example.com',
        }));
        break;

      case 'ping':
        socket.send(JSON.stringify({ type: 'pong' }));
        break;
    }
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

MIT — phpMyDEV, LLC
