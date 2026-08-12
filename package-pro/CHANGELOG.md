# Changelog

All notable changes to `rte-rich-text-editor-pro` will be documented in this file.

## [1.0.38] - 2026-08-11
- Fixed the column feature (2/3-column layout) nesting the column grid inside a heading: inserting columns with the caret in an empty heading — or with a heading's text fully selected — put the `.rte-pro-cols` grid *inside* the `<h1>`, so the columns and their content rendered as heading text. Columns now insert as a top-level block via DOM (not `execCommand insertHTML`), never nested in a heading — an empty heading is replaced, a non-empty block keeps its content with the columns added after.

## [1.0.37] - 2026-08-05
- Toolbar is now genuinely sticky while scrolling a long document. `.rte-wrap { overflow: hidden }` (there to clip the rounded corners) was silently trapping the toolbar's `position: sticky`, so it scrolled off-screen; changed to `overflow: clip` (clips identically but doesn't create a scroll container). The toolbar now pins to the top as `stickyToolbar` (default on) intends.
- Toolbar font and block dropdowns now track the cursor — they reflect the font and block where the caret sits, updated on every cursor move. Changing a heading's font is now a single selection instead of the pick-a-different-font-then-reselect workaround a stale dropdown value forced.

## [1.0.36] - 2026-08-05
- Paste sanitizer now preserves the HTML sectioning tags — `section`, `article`, `header`, `footer`, `main`, `nav`, `aside` — instead of unwrapping them, so pasted document structure survives instead of being flattened.
- Added the `aiEndpoint` option: a simple higher-level AI integration where the editor `POST`s `{ prompt }` (with `credentials: 'same-origin'`, so the session cookie is sent) to your endpoint and reads `{ ok, text }`. Non-streaming; the server owns the model, system prompt, auth/entitlement, and rate limits, and the API key never touches the browser. Returned `text` is sanitized before preview/insert (same allowlist as paste). Complements the existing provider-shaped `aiProxy`; off by default.

## [1.0.35] - 2026-08-05
- Security: sanitize AI-assistant output before it is previewed or inserted. AI-generated HTML now passes through the same allowlist sanitizer as pasted content (drops `<script>`, `on*` handlers, `javascript:` URLs), closing a prompt-injection -> XSS path where a crafted model response (e.g. `<img onerror>`) executed on preview render or on insert.
- Hardened the AI system prompt and delimited the document region so instructions embedded in document text are treated as data, not commands (defense in depth).

## [1.0.34] - 2026-07-16
- The Link button now wraps a selected image in an anchor: when an image is selected in the editor frame, clicking Insert Link wraps it in `<a href>` (or updates the href if it is already linked) instead of doing nothing. The image is wrapped via DOM APIs (no HTML-string injection).
- Linked images serialize to `[![alt](src)](href)` and round-trip through `getMarkdown()` / `setMarkdown()`.

## [1.0.33] - 2026-07-16
- Fixed `getMarkdown()` carrying HTML container nesting (`<div>`/`<section>` depth) into leading whitespace, which made block content (headings, paragraphs, links) render as indented code blocks in CommonMark. Block lines are now de-indented; whitespace inside fenced code blocks is preserved.
- Multi-line `<pre>`/`<pre><code>` blocks are now captured (previously left unfenced and mangled).

## [1.0.32] - 2026-07-14
- Changed the default `aiModel` from `claude-sonnet-4-5-20250929` (legacy) to `claude-haiku-4-5`
- Consumers that allowlist models on their AI proxy must allowlist the default their pinned
  version sends: `<= 1.0.31` sends `claude-sonnet-4-5-20250929`, `>= 1.0.32` sends `claude-haiku-4-5`

## [1.0.21] - 2026-02-25
- Added interactive checklists: `/checklist` slash command, toolbar button, click-to-toggle, Enter key handling
- Added floating/bubble toolbar on text selection (Bold, Italic, Underline, Link, Highlight)
- Added AI autocomplete ghost text with Tab-to-accept (`aiAutocomplete` option)
- Added `setAiAutocomplete()` API method

## [1.0.19] - 2026-02-22
- Added multi-provider AI support (OpenAI, Gemini, Anthropic) via `aiProvider` option
- Added `AI_PROVIDERS` adapter pattern for provider-agnostic AI calls
- Refactored `runAICommand`, `runAIGenerate`, and `api.ai.run` to use provider adapters
- Default provider remains `"anthropic"` — zero change for existing users

## [1.0.16] - 2026-02-21
- Fixed editor background color not included in exported/rendered HTML

## [1.0.15] - 2026-02-21
- Added Editor Background color button — changes entire editor content area background color

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
