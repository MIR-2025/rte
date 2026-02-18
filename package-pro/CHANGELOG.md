# Changelog

All notable changes to `rte-rich-text-editor-pro` will be documented in this file.

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
- Text shadow, gradient text, borders, block background popups
- Anchor/bookmark and Math/LaTeX insertion
- Columns layout (1/2/3), page break, text transform, line/letter spacing
- LTR/RTL direction toggle
- 30+ public API methods
- TypeScript declarations included
- UMD wrapper (browser global, CommonJS, AMD)
- Zero dependencies, single file (~118KB)
