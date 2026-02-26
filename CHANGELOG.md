# Changelog

All notable changes will be documented in this file.

## rte-rich-text-editor-pro

#### [1.0.21] - 2026-02-25
- Added interactive checklists: `/checklist` slash command, toolbar button, click-to-toggle, Enter key handling
- Added floating/bubble toolbar on text selection (Bold, Italic, Underline, Link, Highlight)
- Added AI autocomplete ghost text with Tab-to-accept (`aiAutocomplete` option)
- Added `setAiAutocomplete()` API method
- Checklist export with inline styles for email compatibility

#### [1.0.19] - 2026-02-22
- Added multi-provider AI support (OpenAI, Gemini, Anthropic) via `aiProvider` option
- Added `AI_PROVIDERS` adapter pattern — each provider has url, headers, body, and stream/response text extractors
- Refactored `runAICommand`, `runAIGenerate`, and `api.ai.run` to use provider adapters
- Updated server proxy (`app.js`) with multi-provider routing via `_provider` field
- Supported env vars: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`

#### [1.0.14] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

#### [1.0.13] - 2026-02-18
- Fixed HTML export stripping column layout classes (columns, page breaks, mentions now preserved)
- Fixed drag handle and column handle elements leaking into exports
- Added inline styles for email-compatible column exports (table-cell layout)
- Added cleanText() for drag-handle-free text exports

#### [1.0.12] - 2026-02-18
- Restored accidentally deleted package screenshots (rte-pro.png, rte-pro-fr.png)

#### [1.0.11] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed gradient text overwriting existing styles (now preserves bold, italic, etc.)
- Fixed columns not allowing new content below (added trailing paragraph)
- Added "Remove Columns" to right-click context menu
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

#### [1.0.10] - 2026-02-18
- Added Find & Replace screenshot to README

#### [1.0.9] - 2026-02-18
- Added filename input to export bar for custom export filenames

#### [1.0.8] - 2026-02-18
- Added cross-links to all 7 npm packages in README

#### [1.0.7] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

#### [1.0.6] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

#### [1.0.5] - 2026-02-18
- Added live preview tabs and Pro demo page

#### [1.0.4] - 2026-02-17
- Version bump for README updates

#### [1.0.3] - 2026-02-17
- Strip document-level tags (DOCTYPE, html, head, style, body) from AI responses and exports
- Removed max-width:800px constraint from exported HTML

#### [1.0.2] - 2026-02-17
- Fixed onChange not firing on toolbar actions (added MutationObserver)
- Fixed `api` reference error during init
- Custom 50-state undo/redo now wired to Ctrl+Z/Y and toolbar buttons

#### [1.0.1] - 2026-02-17
- Added screenshot, changelog, and `rte-pro.png` to npm package

#### [1.0.0] - 2026-02-17
- Initial release — full-featured WYSIWYG editor with AI integration
- 16 configurable toolbar groups, AI panel with Anthropic Claude SSE streaming
- Slash commands, @ mentions, hashtag auto-linking
- Find & Replace, source view, markdown toggle, fullscreen
- Custom 50-state undo/redo, version history, auto-save
- Content analysis: readability, SEO, accessibility
- Tables, footnotes, TOC, code highlighting, gridlines
- Drag & drop, focus mode, watermark, word/char goals
- 30+ API methods, TypeScript declarations, UMD, zero dependencies

## rte-rich-text-editor-pro-ws

#### [1.0.9] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

#### [1.0.8] - 2026-02-18
- Fixed HTML export stripping column layout classes (columns, page breaks, mentions now preserved)
- Fixed drag handle and column handle elements leaking into exports
- Added inline styles for email-compatible column exports (table-cell layout)
- Added cleanText() for drag-handle-free text exports

#### [1.0.7] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed gradient text overwriting existing styles (now preserves bold, italic, etc.)
- Fixed columns not allowing new content below (added trailing paragraph)
- Added "Remove Columns" to right-click context menu
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

#### [1.0.6] - 2026-02-18
- Added Find & Replace screenshot to README

#### [1.0.5] - 2026-02-18
- Added filename input to export bar for custom export filenames

#### [1.0.4] - 2026-02-18
- Added cross-links to all 7 npm packages in README

#### [1.0.3] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

#### [1.0.2] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

#### [1.0.1] - 2026-02-18
- Version bump for README updates

#### [1.0.0] - 2026-02-17
- Initial release — RTEPro editor + WebSocket connector bundled in a single file

## rte-rich-text-editor

### [1.0.26] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

### [1.0.25] - 2026-02-18
- Added cleanHTML() for clean exports (strips resize classes, image overlays, contenteditable attributes)

### [1.0.24] - 2026-02-18
- Restored accidentally deleted package screenshot (rte.png)

### [1.0.23] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

### [1.0.22] - 2026-02-18
- Added filename input to export bar for custom export filenames

### [1.0.21] - 2026-02-18
- Added cross-links to all 7 npm packages in README

### [1.0.20] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

### [1.0.19] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

### [1.0.18] - 2026-02-18
- Version bump for README updates

### [1.0.17] - 2026-02-17
- Added `exportCSS` option to append custom CSS to `getFullHTML()` exports
- Added `exportTemplate` option for full control over `getFullHTML()` output (use `{{content}}` placeholder)

### [1.0.16] - 2026-02-17
- Media responsive: images, video, and audio scale with `max-width: 100%` and `height: auto`

### [1.0.15] - 2026-02-17
- Added changelog to README

### [1.0.14] - 2026-02-17
- Added explicit `type="button"` to `btn()` and `fmtBtn()` helpers

### [1.0.13] - 2026-02-17
- Added `type="button"` to all editor buttons via `el()` helper to prevent form submission when editor is inside a `<form>`

### [1.0.12] - 2026-02-17
- Made editor vertically resizable (CSS `resize: vertical`, removed `max-height` cap)

### [1.0.11] - 2026-02-17
- Removed `max-width: 100%` on images so they insert at full native resolution
- Changed `.rte-content` overflow from `overflow-y: auto` to `overflow: auto` for horizontal scrolling

### [1.0.10] - 2026-02-17
- Added click-to-resize image handles with proportional drag resizing
- Blue overlay with 4 corner handles appears on image click
- Delete/Backspace removes selected image, Escape clears selection
- Resize classes stripped from `getHTML()` and `getJSON()` exports
- Cleanup in `destroy()` method

### [1.0.9] - 2026-02-16
- Added related package links (ws, bundle) to README

### [1.0.8] - 2026-02-16
- Added repository URL, author, and bugs URL to package metadata
- Added MIT LICENSE file

### [1.0.7] - 2026-02-16
- Removed mailto integration from Email button to fix Socket.dev network access warning
- Email button now copies rich HTML to clipboard instead of opening mail client
- Fixes issue with Brave browser opening Outlook instead of default mail client

### [1.0.6] - 2026-02-16
- Updated README CDN/script tag examples to use full domain `https://rte.whitneys.co/rte.js`

### [1.0.5] - 2026-02-16
- Improved Email button: copies rich HTML to clipboard then opens mail client
- Fixed mailto body truncation issue for long editor content

### [1.0.4] - 2026-02-16
- Added screenshot to npm README

### [1.0.3] - 2026-02-16
- Reverted fetch-based URL-to-base64 conversion to fix Socket.dev network access warning
- File uploads, drag & drop, and clipboard paste still base64 encode automatically

### [1.0.2] - 2026-02-16
- Added fetch-based base64 encoding for URL-pasted images (reverted in 1.0.3)

### [1.0.1] - 2026-02-15
- Fixed stale package name reference in ESM entry point (`rte-editor` → `rte-rich-text-editor`)

### [1.0.0] - 2026-02-15
- Initial release
- Single-file rich text editor with embedded CSS, zero dependencies
- UMD wrapper for browser, CommonJS, and AMD support
- Full toolbar: formatting, fonts, sizes, colors, alignment, lists, media, tables, emoji
- Export bar: Save HTML, Save Text, Copy HTML, Copy Text, Email, Print/PDF, JSON
- Drag & drop and clipboard paste for images, video, audio
- CSS custom properties for theming
- TypeScript declarations included

## rte-rich-text-editor-bundle

#### [1.0.17] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

#### [1.0.16] - 2026-02-18
- Added cleanHTML() for clean exports (strips resize classes, image overlays, contenteditable attributes)

#### [1.0.15] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

#### [1.0.14] - 2026-02-18
- Version bump for README updates

#### [1.0.13] - 2026-02-18
- Added filename input to export bar for custom export filenames

#### [1.0.12] - 2026-02-18
- Added cross-links to all 7 npm packages in README

#### [1.0.11] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

#### [1.0.10] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

#### [1.0.9] - 2026-02-18
- Version bump for README updates

#### [1.0.8] - 2026-02-17
- Synced with rte-rich-text-editor 1.0.17 (`exportCSS`, `exportTemplate`, responsive media)

#### [1.0.7] - 2026-02-17
- Media responsive: images, video, and audio scale with `max-width: 100%` and `height: auto`

#### [1.0.6] - 2026-02-17
- Added changelog to README

#### [1.0.5] - 2026-02-17
- Added explicit `type="button"` to all editor buttons to prevent form submission

#### [1.0.4] - 2026-02-17
- Added `type="button"` via `el()` helper to prevent form submission when editor is inside a `<form>`

#### [1.0.3] - 2026-02-17
- Synced with rte-rich-text-editor 1.0.12 (image resize, content overflow, vertical resizing)

#### [1.0.2] - 2026-02-16
- Added CommonJS and ES Modules usage examples to README

#### [1.0.1] - 2026-02-16
- Added TypeScript declarations (`rte-bundle.d.ts`) for both RTE and RTEWS
- Added `exports`, `module`, and `types` fields to package.json

#### [1.0.0] - 2026-02-16
- Initial release — RTE editor + WebSocket connector bundled in a single file
- Available at `https://rte.whitneys.co/rte-bundle.js`

## rte-rich-text-editor-ws

#### [1.0.9] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

#### [1.0.8] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

#### [1.0.7] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

#### [1.0.6] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

#### [1.0.5] - 2026-02-18
- Version bump (no code changes — WebSocket wrapper only)

#### [1.0.4] - 2026-02-18
- Added cross-links to all 7 npm packages in README

#### [1.0.3] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

#### [1.0.2] - 2026-02-16
- Added CommonJS and ES Modules usage examples to README

#### [1.0.1] - 2026-02-16
- Added related package links to README

#### [1.0.0] - 2026-02-16
- Initial release — standalone WebSocket connector for RTE
- Auto-save with configurable debounce
- Real-time collaboration with cursor preservation
- Auto-reconnect with exponential backoff
- Heartbeat keep-alive
- UMD wrapper (script tag, CommonJS, AMD)
- Available at `https://rte.whitneys.co/rte-ws.js`

## websocket-toolkit

#### [1.0.0] - 2026-02-16
- Initial release — same as wskit-client, published under alternate name
- Universal WebSocket client, zero dependencies

## wskit-client

#### [1.0.0] - 2026-02-16
- Initial release — universal WebSocket client, zero dependencies
- Auto-reconnect with exponential backoff
- Message queue (buffers sends while disconnected, flushes on reconnect)
- Channel-based message routing by type field
- Request/response pattern with Promises
- Configurable heartbeat keep-alive
- Auto JSON parse/stringify
- Debug mode for verbose console logging
- UMD wrapper (script tag, CommonJS, AMD, ES Modules)
- TypeScript declarations included
