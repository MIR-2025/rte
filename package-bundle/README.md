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

### CommonJS

```js
const RTE = require('rte-rich-text-editor-bundle');
const editor = RTE.init('#editor');
```

### ES Modules

```js
import RTE from 'rte-rich-text-editor-bundle';
const editor = RTE.init('#editor');
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

All notable changes to `rte-rich-text-editor-bundle` will be documented in this file.

## [1.0.11] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.8] - 2026-02-17
- Synced with rte-rich-text-editor 1.0.17 (`exportCSS`, `exportTemplate`, responsive media)

## [1.0.7] - 2026-02-17
- Media responsive: images, video, and audio scale with `max-width: 100%` and `height: auto`

## [1.0.6] - 2026-02-17
- Added changelog to README

## [1.0.5] - 2026-02-17
- Added explicit `type="button"` to all editor buttons to prevent form submission

## [1.0.4] - 2026-02-17
- Added `type="button"` via `el()` helper to prevent form submission when editor is inside a `<form>`

## [1.0.3] - 2026-02-17
- Synced with rte-rich-text-editor 1.0.12 (image resize, content overflow, vertical resizing)

## [1.0.2] - 2026-02-16
- Added CommonJS and ES Modules usage examples to README

## [1.0.1] - 2026-02-16
- Added TypeScript declarations (`rte-bundle.d.ts`) for both RTE and RTEWS
- Added `exports`, `module`, and `types` fields to package.json

## [1.0.0] - 2026-02-16
- Initial release — RTE editor + WebSocket connector bundled in a single file

## License

MIT
