# Changelog

All notable changes to `rte-rich-text-editor-bundle` will be documented in this file.

## [1.0.15] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

## [1.0.13] - 2026-02-18
- Added filename input to export bar for custom export filenames

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
