# Changelog

All notable changes to `rte-rich-text-editor-pro-ws` will be documented in this file.

## [1.0.32] - 2026-08-05
- Toolbar is now genuinely sticky while scrolling a long document. `.rte-wrap { overflow: hidden }` (there to clip the rounded corners) was silently trapping the toolbar's `position: sticky`, so it scrolled off-screen; changed to `overflow: clip` (clips identically but doesn't create a scroll container). The toolbar now pins to the top as `stickyToolbar` (default on) intends.
- Toolbar font and block dropdowns now track the cursor — they reflect the font and block where the caret sits, updated on every cursor move. Changing a heading's font is now a single selection instead of the pick-a-different-font-then-reselect workaround a stale dropdown value forced.

## [1.0.31] - 2026-08-05
- Paste sanitizer now preserves the HTML sectioning tags — `section`, `article`, `header`, `footer`, `main`, `nav`, `aside` — instead of unwrapping them, so pasted document structure survives instead of being flattened.
- Added the `aiEndpoint` option: a simple higher-level AI integration where the editor `POST`s `{ prompt }` (with `credentials: 'same-origin'`, so the session cookie is sent) to your endpoint and reads `{ ok, text }`. Non-streaming; the server owns the model, system prompt, auth/entitlement, and rate limits, and the API key never touches the browser. Returned `text` is sanitized before preview/insert (same allowlist as paste). Complements the existing provider-shaped `aiProxy`; off by default.

## [1.0.30] - 2026-08-05
- Security: sanitize AI-assistant output before it is previewed or inserted. AI-generated HTML now passes through the same allowlist sanitizer as pasted content (drops `<script>`, `on*` handlers, `javascript:` URLs), closing a prompt-injection -> XSS path where a crafted model response (e.g. `<img onerror>`) executed on preview render or on insert.
- Hardened the AI system prompt and delimited the document region so instructions embedded in document text are treated as data, not commands (defense in depth).

## [1.0.29] - 2026-07-16
- The Link button now wraps a selected image in an anchor: when an image is selected in the editor frame, clicking Insert Link wraps it in `<a href>` (or updates the href if it is already linked) instead of doing nothing. The image is wrapped via DOM APIs (no HTML-string injection).
- Linked images serialize to `[![alt](src)](href)` and round-trip through `getMarkdown()` / `setMarkdown()`.

## [1.0.28] - 2026-07-16
- Fixed `getMarkdown()` carrying HTML container nesting (`<div>`/`<section>` depth) into leading whitespace, which made block content (headings, paragraphs, links) render as indented code blocks in CommonMark. Block lines are now de-indented; whitespace inside fenced code blocks is preserved.
- Multi-line `<pre>`/`<pre><code>` blocks are now captured (previously left unfenced and mangled).

## [1.0.27] - 2026-07-14
- Changed the default `aiModel` from `claude-sonnet-4-5-20250929` (legacy) to `claude-haiku-4-5`
- Consumers that allowlist models on their AI proxy must allowlist the default their pinned
  version sends: `<= 1.0.26` sends `claude-sonnet-4-5-20250929`, `>= 1.0.27` sends `claude-haiku-4-5`

## [1.0.16] - 2026-02-25
- Added interactive checklists: `/checklist` slash command, toolbar button, click-to-toggle, Enter key handling
- Added floating/bubble toolbar on text selection (Bold, Italic, Underline, Link, Highlight)
- Added AI autocomplete ghost text with Tab-to-accept (`aiAutocomplete` option)
- Added `setAiAutocomplete()` API method

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
