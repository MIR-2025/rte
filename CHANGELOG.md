# Changelog

All notable changes to RTE — Rich Text Editor will be documented in this file.

## rte-rich-text-editor-bundle

#### [1.0.2] - 2026-02-16
- Added CommonJS and ES Modules usage examples to README

#### [1.0.1] - 2026-02-16
- Added TypeScript declarations (`rte-bundle.d.ts`) for both RTE and RTEWS
- Added `exports`, `module`, and `types` fields to package.json

#### [1.0.0] - 2026-02-16
- Initial release — RTE editor + WebSocket connector bundled in a single file
- Available at `https://rte.whitneys.co/rte-bundle.js`

## rte-rich-text-editor-ws

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

## rte-rich-text-editor

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
