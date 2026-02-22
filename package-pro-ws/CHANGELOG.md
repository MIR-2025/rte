# Changelog

All notable changes to `rte-rich-text-editor-pro-ws` will be documented in this file.

## [1.0.14] - 2026-02-22
- Added multi-provider AI support (OpenAI, Gemini, Anthropic) via `aiProvider` option
- Added `AI_PROVIDERS` adapter pattern for provider-agnostic AI calls
- Refactored `runAICommand`, `runAIGenerate`, and `api.ai.run` to use provider adapters
- Default provider remains `"anthropic"` — zero change for existing users

## [1.0.11] - 2026-02-21
- Fixed editor background color not included in exported/rendered HTML

## [1.0.10] - 2026-02-21
- Added Editor Background color button — changes entire editor content area background color

## [1.0.9] - 2026-02-18
- Added "Link Text" field to Insert Link popup — set custom anchor text or leave blank to wrap selection

## [1.0.8] - 2026-02-18
- Fixed HTML export stripping column layout classes (columns, page breaks, mentions now preserved)
- Fixed drag handle and column handle elements leaking into exports
- Added inline styles for email-compatible column exports (table-cell layout)
- Added cleanText() for drag-handle-free text exports

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

## [1.0.4] - 2026-02-18
- Added cross-links to all 7 npm packages in README

## [1.0.3] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

## [1.0.2] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.1] - 2026-02-18
- Version bump for README updates

## [1.0.0] - 2026-02-17
- Initial release — RTEPro editor + WebSocket connector bundled in a single file
- Includes all RTEPro 1.0.3 features (16 toolbar groups, AI integration, slash commands, mentions, etc.)
- WebSocket connector (RTEProWS) with auto-save, real-time collaboration, auto-reconnect, heartbeat
- Single script tag, zero dependencies
