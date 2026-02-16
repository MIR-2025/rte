# RTE Bundle — Rich Text Editor + WebSocket

Everything in one file. RTE Rich Text Editor and the WebSocket connector bundled together. **One script tag. Zero dependencies.**

![RTE Rich Text Editor](https://rte.whitneys.co/rte.png)

## Install

### npm

```bash
npm install rte-rich-text-editor-bundle
```

### Script Tag

```html
<script src="https://unpkg.com/rte-rich-text-editor-bundle/rte-bundle.js"></script>
```

### Self-Hosted

```html
<script src="rte-bundle.js"></script>
```

## Quick Start

### Editor Only

```html
<div id="editor"></div>
<script src="rte-bundle.js"></script>
<script>
  const editor = RTE.init('#editor');
</script>
```

### Editor + WebSocket

```html
<div id="editor"></div>
<script src="rte-bundle.js"></script>
<script>
  const editor = RTE.init('#editor');

  const ws = RTEWS.connect(editor, 'wss://yourserver.com/ws', {
    docId: 'doc-123',
    userId: 'user-abc',
    onSaved: (msg) => console.log('Saved'),
    onRemoteUpdate: (msg) => console.log('Update from:', msg.userId),
  });
</script>
```

## What's Included

| Global | Description |
|---|---|
| `RTE` | Rich text editor — formatting, media, tables, emoji, export |
| `RTEWS` | WebSocket connector — auto-save, collaboration, reconnect |

## Separate Packages

If you only need the editor or only the WebSocket connector:

- **Editor only:** [`rte-rich-text-editor`](https://www.npmjs.com/package/rte-rich-text-editor)
- **WebSocket only:** [`rte-rich-text-editor-ws`](https://www.npmjs.com/package/rte-rich-text-editor-ws)

## Documentation

- [Editor docs](https://rte.whitneys.co/docs)
- [API reference](https://rte.whitneys.co/api)
- [WebSocket docs](https://rte.whitneys.co/websocket)
- [Examples](https://rte.whitneys.co/examples)

## License

MIT — phpMyDEV, LLC
