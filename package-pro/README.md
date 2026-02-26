# RTEPro — Full-Featured WYSIWYG Editor with AI

A standalone, embeddable rich text editor with AI integration, 16 toolbar groups, slash commands, mentions, version history, and more. One script tag. Zero dependencies.

![RTEPro Editor](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro-1.png)

![RTEPro Screenshot](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro.png)

![RTEPro Find & Replace](https://raw.githubusercontent.com/MIR-2025/rte/main/package-pro/rte-pro-fr.png)

## Install

```bash
npm install rte-rich-text-editor-pro
```

Or via CDN:

```html
<script src="https://unpkg.com/rte-rich-text-editor-pro/rte-pro.js"></script>
```

## Quick Start

```html
<div id="editor"></div>
<script src="rte-pro.js"></script>
<script>
  const editor = RTEPro.init('#editor', {
    placeholder: 'Start typing...',
    height: '400px',
  });
</script>
```

## AI Integration

Supports **Anthropic Claude** (default), **OpenAI GPT**, and **Google Gemini**. Set `aiProvider` to switch providers.

> **Warning:** Never use `apiKey` in production web apps — it exposes your API key in the browser where anyone can steal it. Use `aiProxy` to route requests through your own server, which keeps the key secret.

**Recommended: Server-side proxy (keeps your key safe)**

```js
// Anthropic (default)
const editor = RTEPro.init('#editor', {
  aiProxy: '/api/ai',
});

// OpenAI
const editor = RTEPro.init('#editor', {
  aiProvider: 'openai',
  aiModel: 'gpt-4o',
  aiProxy: '/api/ai',
});

// Gemini
const editor = RTEPro.init('#editor', {
  aiProvider: 'gemini',
  aiModel: 'gemini-2.0-flash',
  aiProxy: '/api/ai',
});
```

Your proxy endpoint receives the JSON body from the editor with a `_provider` field indicating which provider to route to. Set the corresponding API key server-side (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or `GEMINI_API_KEY`).

**Direct API key (only for local dev / internal tools)**

```js
const editor = RTEPro.init('#editor', {
  aiProvider: 'openai',
  aiModel: 'gpt-4o',
  apiKey: 'sk-...',
});
```

## Toolbar Groups (16)

`format` · `text` · `color` · `align` · `list` · `insert` · `block` · `style` · `direction` · `tools` · `history` · `cleanup` · `advanced` · `mode` · `analysis` · `ai`

Show only specific groups:

```js
RTEPro.init('#editor', {
  toolbar: ['text', 'format', 'insert', 'ai'],
});
```

## Features

- **AI Panel** — Rewrite, summarize, expand, fix grammar, change tone, translate (10 languages), continue writing, generate from prompt. Supports Anthropic Claude, OpenAI GPT, and Google Gemini with SSE streaming. **Ask AI Anything** lets you type any freeform instruction using the editor's current content as context — e.g. "Make this more formal", "Add bullet points", "Explain this in simpler terms".
- **Slash Commands** — Type `/` for headings, lists, quotes, code, tables, images, dividers, and more.
- **@ Mentions** — Type `@` to search and insert mentions from a configurable list.
- **Find & Replace** — Ctrl+F with regex support, match highlighting, and replace all.
- **Source View** — Toggle HTML source editing with Ctrl+/.
- **Markdown Toggle** — Switch between WYSIWYG and Markdown with Ctrl+Shift+M.
- **Version History** — Save, browse, and restore document versions.
- **50-State Undo/Redo** — Custom snapshot-based undo system.
- **Fullscreen** — F11 or Ctrl+Shift+F.
- **Content Analysis** — Readability (Flesch-Kincaid), SEO checker, accessibility checker.
- **Tables** — Insert, add/delete rows and columns, context menu editing.
- **Footnotes & TOC** — Auto-numbered footnotes, generated table of contents.
- **Gridlines** — Toggle element outlines for layout debugging.
- **Auto-Save** — Configurable localStorage persistence with restore prompt.
- **Drag & Drop** — Reorder blocks by dragging.
- **Focus Mode** — Dim non-active paragraphs.
- **Watermark** — Overlay text (e.g., "DRAFT").
- **Word/Char Goals** — Progress bars for writing targets.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `placeholder` | string | `''` | Placeholder text |
| `height` | string | `'300px'` | Editor height |
| `apiKey` | string | `null` | API key (direct, **not recommended for production**) |
| `aiProxy` | string | `null` | Server proxy URL for AI requests (recommended) |
| `aiProvider` | string | `'anthropic'` | AI provider: `'anthropic'`, `'openai'`, or `'gemini'` |
| `aiModel` | string | `'claude-sonnet-4-5-20250929'` | AI model (provider-specific) |
| `toolbar` | string[] | `null` | Toolbar groups to show (null = all) |
| `autosave` | boolean/number | `false` | Auto-save interval (true = 30s, or ms) |
| `wordGoal` | number | `0` | Word count goal |
| `charGoal` | number | `0` | Character count goal |
| `mentions` | array | `[]` | Mention suggestions `[{name, id, avatar?}]` |
| `hashtagUrl` | string | `null` | Hashtag link pattern, e.g. `'/tags/{{tag}}'` |
| `watermark` | string | `null` | Watermark overlay text |
| `focusMode` | boolean | `false` | Start in focus mode |
| `maxVersions` | number | `20` | Max saved versions |

## API

```js
editor.getHTML()        // Clean HTML string
editor.getText()        // Plain text
editor.getMarkdown()    // Markdown conversion
editor.getJSON()        // { html, text, words, chars }
editor.getFullHTML()    // Full document with styles
editor.setHTML(html)    // Set content
editor.insertAtCursor(html)
editor.getWordCount()
editor.getCharCount()
editor.isEmpty()
editor.focus()
editor.blur()
editor.toggleFullscreen()
editor.toggleSource()
editor.toggleMarkdown()
editor.toggleGridlines()
editor.toggleFindBar()
editor.toggleFocusMode()
editor.toggleSpellcheck()
editor.saveVersion(label?)
editor.getReadability()        // { score, grade, level }
editor.getSEOIssues()          // string[]
editor.getAccessibilityIssues() // string[]
editor.print()
editor.destroy()

editor.onChange = ({ words, chars }) => { ... }
```

## Security

> **Treat editor output as untrusted** if any untrusted users can write content.

- **Sanitize server-side** before storing or rendering. The editor outputs raw HTML — always run it through a sanitizer (e.g. [DOMPurify](https://github.com/cure53/DOMPurify), [sanitize-html](https://www.npmjs.com/package/sanitize-html)) before persisting or displaying to other users.
- **Disallow dangerous patterns**: `javascript:` links, inline event handlers (`onclick`, `onerror`, etc.), `<iframe>`, `<script>`, `<object>`, `<embed>`, and `<form>` tags.
- **Never use `apiKey` in production** — use `aiProxy` to keep API keys server-side.

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

All notable changes to `rte-rich-text-editor-pro` will be documented in this file.

## [1.0.21] - 2026-02-25
- Added interactive checklists: `/checklist` slash command, toolbar button, click-to-toggle, Enter key handling
- Added floating/bubble toolbar on text selection (Bold, Italic, Underline, Link, Highlight)
- Added AI autocomplete ghost text with Tab-to-accept (`aiAutocomplete` option)
- Added `setAiAutocomplete()` API method
- Checklist inline styles for email-compatible export

## [1.0.20] - 2026-02-23
- Added multi-provider AI support: OpenAI (`gpt-4o`) and Google Gemini (`gemini-2.0-flash`) alongside Anthropic Claude
- Added `aiProvider` option (`'anthropic'` | `'openai'` | `'gemini'`)
- Server proxy now routes via `_provider` field to the correct upstream API
- Updated README with multi-provider examples and `aiProvider` option docs

## [1.0.18] - 2026-02-21
- Fixed editor background color not included in exported/rendered HTML

## [1.0.17] - 2026-02-21
- Added Editor Background color button — changes entire editor content area background color

## [1.0.16] - 2026-02-19
- Added `aiProxy` option to proxy AI requests through your server (keeps API key secret)
- API key no longer required in browser when using `aiProxy`
- Updated README with security warning about direct `apiKey` usage in production

## [1.0.14] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

## [1.0.13] - 2026-02-18
- Fixed HTML export stripping column layout classes (columns, page breaks, mentions now preserved)
- Fixed drag handle and column handle elements leaking into exports
- Added inline styles for email-compatible column exports (table-cell layout)
- Added cleanText() for drag-handle-free text exports

## [1.0.12] - 2026-02-18
- Restored accidentally deleted package screenshots (rte-pro.png, rte-pro-fr.png)

## [1.0.11] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed gradient text overwriting existing styles (now preserves bold, italic, etc.)
- Fixed columns not allowing new content below (added trailing paragraph)
- Added "Remove Columns" to right-click context menu
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

## [1.0.10] - 2026-02-18
- Added Find & Replace screenshot to README

## [1.0.9] - 2026-02-18
- Added filename input to export bar for custom export filenames

## [1.0.6] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.2] - 2026-02-17
- Fixed onChange not firing on toolbar actions (added MutationObserver)
- Fixed `api` reference error during init
- Strip document-level tags (DOCTYPE, html, head, style, body) from AI responses and exports
- Removed max-width:800px constraint from exported HTML
- Custom 50-state undo/redo now wired to Ctrl+Z/Y and toolbar buttons

## [1.0.1] - 2026-02-17
- Added screenshot to npm README
- Added CHANGELOG.md to package
- Added `rte-pro.png` to package files

## [1.0.0] - 2026-02-17
- Initial release — full-featured WYSIWYG editor with AI integration
- 16 configurable toolbar groups (format, text, color, align, list, insert, block, style, direction, tools, history, cleanup, advanced, mode, analysis, ai)
- AI panel with Anthropic Claude SSE streaming (rewrite, summarize, expand, fix grammar, change tone, translate, continue writing, generate from prompt)
- AI responses output as clean HTML with automatic markdown-to-HTML fallback
- Slash commands — type `/` for 15+ quick-insert commands
- @ mentions — type `@` to search and insert from configurable mention list
- Hashtag auto-linking with configurable URL pattern
- Find & Replace with regex support and match highlighting
- Source view (HTML editing) with Ctrl+/
- Markdown toggle (HTML↔MD) with Ctrl+Shift+M
- Fullscreen mode (F11 / Ctrl+Shift+F)
- Custom 50-state undo/redo system (replaces browser's limited undo)
- Version history — save, browse, and restore document snapshots
- Auto-save to localStorage with restore prompt on init
- Content analysis: Flesch-Kincaid readability, SEO checker, accessibility checker
- Tables with add/delete rows/columns and context menu editing
- Footnotes (auto-numbered) and Table of Contents generation
- Gridlines/element outlines for layout debugging
- Drag & drop block reordering
- Focus/distraction-free mode
- Watermark overlay
- Word/character count goals with progress bars
- Code syntax highlighting (keywords, strings, comments, numbers)
- Special characters popup (currency, math, arrows, Greek, symbols)
- Text shadow, gradient text, borders, block background, editor background popups
- Anchor/bookmark and Math/LaTeX insertion
- Columns layout (1/2/3), page break, text transform, line/letter spacing
- LTR/RTL direction toggle
- 30+ public API methods
- TypeScript declarations included
- UMD wrapper (browser global, CommonJS, AMD)
- Zero dependencies, single file (~118KB)
