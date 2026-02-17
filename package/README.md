# RTE — Rich Text Editor

A powerful, standalone rich text editor you can embed into any website. **One script tag. Zero dependencies.**

![RTE Rich Text Editor](https://rte.whitneys.co/rte.png)

## Install

### npm / yarn / pnpm

```bash
npm install rte-rich-text-editor
```

### CDN / Direct Download

Just drop the script tag into any HTML page:

```html
<script src="https://rte.whitneys.co/rte.js"></script>
```

No CSS file needed — styles are injected automatically.

## Quick Start

### Browser (script tag)

```html
<div id="editor"></div>
<script src="https://rte.whitneys.co/rte.js"></script>
<script>
  const editor = RTE.init('#editor');
</script>
```

### CommonJS (Node / require)

```js
const RTE = require('rte-rich-text-editor');
const editor = RTE.init('#editor');
```

### ES Modules (import)

```js
import RTE from 'rte-rich-text-editor';
const editor = RTE.init('#editor');
```

### React

```jsx
import { useEffect, useRef } from 'react';
import RTE from 'rte-rich-text-editor';

function Editor() {
  const ref = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = RTE.init(ref.current);
    return () => editorRef.current?.destroy();
  }, []);

  return <div ref={ref} />;
}
```

### Vue

```vue
<template>
  <div ref="editorEl"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import RTE from 'rte-rich-text-editor';

const editorEl = ref(null);
let editor = null;

onMounted(() => { editor = RTE.init(editorEl.value); });
onUnmounted(() => { editor?.destroy(); });
</script>
```

## Options

```js
const editor = RTE.init('#editor', {
  placeholder: 'Write something...',  // placeholder text
  height: '400px',                     // minimum editor height
});
```

## Features

| Category | Details |
|---|---|
| **Formatting** | Bold, Italic, Underline, Strikethrough, Superscript, Subscript |
| **Headings** | H1–H4 dropdown |
| **Typography** | 9 font families, 7 size levels |
| **Colors** | 40-swatch text color & highlight picker + custom hex |
| **Alignment** | Left, Center, Right, Justify (SVG icons) |
| **Lists** | Bullet, Numbered, Indent, Outdent |
| **Media** | Image, Video, Audio — URL, file upload, drag & drop, clipboard paste |
| **Insert** | Links, Emoji picker, Table (visual grid selector), Blockquote, Code block, Horizontal rule |
| **Export** | Save HTML, Save Text, Copy HTML, Copy Text, Email, Print/PDF, JSON |
| **Keyboard** | Ctrl+B/I/U/S/Z/Y, Ctrl+Shift+Z |
| **Status** | Live word & character count |
| **Theming** | CSS custom properties for full visual control |

## API

### Content

```js
editor.getHTML()          // "<p><strong>Hello</strong></p>"
editor.setHTML('<p>Hi</p>')
editor.getText()          // "Hello"
editor.getFullHTML()      // complete HTML document with styles
editor.getJSON()          // { html, text, wordCount, charCount, createdAt }
```

### Export

```js
editor.saveHTML('doc.html')   // download HTML file
editor.saveText('doc.txt')    // download text file
editor.copyHTML()             // rich HTML to clipboard (paste into Gmail, etc.)
editor.copyText()             // plain text to clipboard
editor.email('to@x.com', 'Subject')
editor.print()                // print preview / save as PDF
```

### Lifecycle

```js
editor.focus()
editor.destroy()
```

### Properties

```js
editor.element   // the contenteditable div
editor.wrapper   // the outer .rte-wrap container
```

### Events

```js
editor.onChange = ({ html, text, words, chars }) => {
  console.log(words, 'words');
  // auto-save, live preview, etc.
};
```

## Theming

Override CSS custom properties to match your brand:

```css
.rte-wrap {
  --rte-accent: #e94560;
  --rte-bg: #1a1a2e;
  --rte-toolbar-bg: #16213e;
  --rte-border: #334155;
  --rte-hover: #1e3a5f;
}
```

## TypeScript

Full type definitions are included (`rte.d.ts`).

```ts
import RTE, { RTEInstance, RTEChangeData } from 'rte-rich-text-editor';

const editor: RTEInstance = RTE.init('#editor')!;
editor.onChange = (data: RTEChangeData) => { ... };
```

## Related Packages

- **[rte-rich-text-editor-ws](https://www.npmjs.com/package/rte-rich-text-editor-ws)** — WebSocket connector for auto-save and real-time collaboration
- **[rte-rich-text-editor-bundle](https://www.npmjs.com/package/rte-rich-text-editor-bundle)** — Editor + WebSocket bundled in a single file

## Changelog

### 1.0.17
- Added `exportCSS` option to append custom CSS to `getFullHTML()` exports
- Added `exportTemplate` option for full control over `getFullHTML()` output (use `{{content}}` placeholder)

### 1.0.16
- Media responsive: images, video, and audio scale with `max-width: 100%` and `height: auto`

### 1.0.15
- Added changelog to README

### 1.0.14
- Added explicit `type="button"` to `btn()` and `fmtBtn()` helpers

### 1.0.13
- Added `type="button"` to all editor buttons to prevent form submission inside `<form>` elements

### 1.0.12
- Made editor vertically resizable (`resize: vertical`, removed `max-height` cap)

### 1.0.11
- Images now insert at full native resolution (removed `max-width: 100%`)
- Added horizontal scrolling for oversized content

### 1.0.10
- Click-to-resize image handles with proportional drag resizing
- Blue overlay with 4 corner handles on image click
- Delete/Backspace removes selected image, Escape clears selection
- Resize classes stripped from exported HTML/JSON

### 1.0.9
- Added related package links (ws, bundle) to README

### 1.0.8
- Added repository URL, author, and bugs URL to package metadata

### 1.0.7
- Email button copies rich HTML to clipboard instead of opening mail client

### 1.0.0
- Initial release — single-file rich text editor, zero dependencies

## License

MIT
