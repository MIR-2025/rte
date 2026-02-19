# Changelog

All notable changes to `rte-rich-text-editor-pro` will be documented in this file.

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

## [1.0.8] - 2026-02-18
- Added cross-links to all 7 npm packages in README

## [1.0.7] - 2026-02-18
- Added CHANGELOG.md to package, appended changelog to README

## [1.0.6] - 2026-02-18
- Added Tab key navigation in tables (Tab = next cell, Shift+Tab = previous cell)
- Tab at last cell automatically creates a new row

## [1.0.5] - 2026-02-18
- Added live preview tabs and Pro demo page

## [1.0.4] - 2026-02-17
- Version bump for README updates

## [1.0.3] - 2026-02-17
- Strip document-level tags (DOCTYPE, html, head, style, body) from AI responses and exports
- Removed max-width:800px constraint from exported HTML

## [1.0.2] - 2026-02-17
- Fixed onChange not firing on toolbar actions (added MutationObserver)
- Fixed `api` reference error during init
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
- Text shadow, gradient text, borders, block background popups
- Anchor/bookmark and Math/LaTeX insertion
- Columns layout (1/2/3), page break, text transform, line/letter spacing
- LTR/RTL direction toggle
- 30+ public API methods
- TypeScript declarations included
- UMD wrapper (browser global, CommonJS, AMD)
- Zero dependencies, single file (~118KB)
