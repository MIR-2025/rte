# Changelog

All notable changes to `rte-rich-text-editor` will be documented in this file.

## [1.0.26] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

## [1.0.25] - 2026-02-18
- Added cleanHTML() for clean exports (strips resize classes, image overlays, contenteditable attributes)

## [1.0.24] - 2026-02-18
- Restored accidentally deleted package screenshot (rte.png)

## [1.0.23] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

## [1.0.22] - 2026-02-18
- Added filename input to export bar for custom export filenames

## [1.0.21] - 2026-02-18
- Added cross-links to all 7 npm packages in README

## [1.0.20] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.19] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

## [1.0.18] - 2026-02-18
- Version bump for README updates

## [1.0.17] - 2026-02-17
- Added `exportCSS` option to append custom CSS to `getFullHTML()` exports
- Added `exportTemplate` option for full control over `getFullHTML()` output (use `{{content}}` placeholder)

## [1.0.16] - 2026-02-17
- Media responsive: images, video, and audio scale with `max-width: 100%` and `height: auto`

## [1.0.15] - 2026-02-17
- Added changelog to README

## [1.0.14] - 2026-02-17
- Added explicit `type="button"` to `btn()` and `fmtBtn()` helpers

## [1.0.13] - 2026-02-17
- Added `type="button"` to all editor buttons via `el()` helper to prevent form submission when editor is inside a `<form>`

## [1.0.12] - 2026-02-17
- Made editor vertically resizable (CSS `resize: vertical`, removed `max-height` cap)

## [1.0.11] - 2026-02-17
- Removed `max-width: 100%` on images so they insert at full native resolution
- Changed `.rte-content` overflow from `overflow-y: auto` to `overflow: auto` for horizontal scrolling

## [1.0.10] - 2026-02-17
- Added click-to-resize image handles with proportional drag resizing
- Blue overlay with 4 corner handles appears on image click
- Delete/Backspace removes selected image, Escape clears selection
- Resize classes stripped from `getHTML()` and `getJSON()` exports
- Cleanup in `destroy()` method

## [1.0.9] - 2026-02-16
- Added related package links (ws, bundle) to README

## [1.0.8] - 2026-02-16
- Added repository URL, author, and bugs URL to package metadata
- Added MIT LICENSE file

## [1.0.7] - 2026-02-16
- Removed mailto integration from Email button to fix Socket.dev network access warning
- Email button now copies rich HTML to clipboard instead of opening mail client

## [1.0.6] - 2026-02-16
- Updated README CDN/script tag examples to use full domain

## [1.0.5] - 2026-02-16
- Improved Email button: copies rich HTML to clipboard then opens mail client

## [1.0.4] - 2026-02-16
- Added screenshot to npm README

## [1.0.3] - 2026-02-16
- Reverted fetch-based URL-to-base64 conversion to fix Socket.dev network access warning

## [1.0.2] - 2026-02-16
- Added fetch-based base64 encoding for URL-pasted images (reverted in 1.0.3)

## [1.0.1] - 2026-02-15
- Fixed stale package name reference in ESM entry point

## [1.0.0] - 2026-02-15
- Initial release
- Single-file rich text editor with embedded CSS, zero dependencies
- UMD wrapper for browser, CommonJS, and AMD support
- Full toolbar: formatting, fonts, sizes, colors, alignment, lists, media, tables, emoji
- Export bar: Save HTML, Save Text, Copy HTML, Copy Text, Email, Print/PDF, JSON
- Drag & drop and clipboard paste for images, video, audio
- CSS custom properties for theming
- TypeScript declarations included
