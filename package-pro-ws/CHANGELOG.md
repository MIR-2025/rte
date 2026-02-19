# Changelog

All notable changes to `rte-rich-text-editor-pro-ws` will be documented in this file.

## [1.0.7] - 2026-02-18
- Added Cut/Copy/Paste toolbar buttons and Ctrl+X/C support for selected images
- Fixed color picker losing text selection on click (mousedown preventDefault)
- Fixed gradient text overwriting existing styles (now preserves bold, italic, etc.)
- Fixed columns not allowing new content below (added trailing paragraph)
- Added "Remove Columns" to right-click context menu
- Fixed toolbar tooltip z-index (tooltips no longer hidden behind next row of buttons)

## [1.0.6] - 2026-02-18
- Added Find & Replace screenshot to README

## [1.0.5] - 2026-02-18
- Added filename input to export bar for custom export filenames

## [1.0.2] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.0] - 2026-02-17
- Initial release — RTEPro editor + WebSocket connector bundled in a single file
- Includes all RTEPro 1.0.3 features (16 toolbar groups, AI integration, slash commands, mentions, etc.)
- WebSocket connector (RTEProWS) with auto-save, real-time collaboration, auto-reconnect, heartbeat
- Single script tag, zero dependencies
