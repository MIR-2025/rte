(function (root, factory) {
  "use strict";
  /* ═══════════════════════════════════════════════════════════
     RTEPro — AI-Driven Full-Featured WYSIWYG Editor
     UMD: works as <script>, CommonJS (require), or ESM (import)
     ═══════════════════════════════════════════════════════════ */
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RTEPro = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ── Inject Styles ────────────────────────────────────────
  const CSS = `
/* RTE Pro Embedded Styles */
.rte-wrap {
  --rte-radius: 10px;
  --rte-border: #d0d5dd;
  --rte-bg: #ffffff;
  --rte-toolbar-bg: #f8f9fb;
  --rte-hover: #e8ecf1;
  --rte-active: #d4dae3;
  --rte-shadow: 0 2px 12px rgba(0,0,0,.08);
  --rte-accent: #6366f1;
  --rte-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-family: var(--rte-font);
  border: 1px solid var(--rte-border);
  border-radius: var(--rte-radius);
  box-shadow: var(--rte-shadow);
  overflow: hidden;
  background: var(--rte-bg);
  position: relative;
  max-width: 100%;
  box-sizing: border-box;
}
.rte-wrap *, .rte-wrap *::before, .rte-wrap *::after { box-sizing: border-box; }
.rte-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  padding: 6px 8px;
  background: var(--rte-toolbar-bg);
  border-bottom: 1px solid var(--rte-border);
  align-items: center;
  user-select: none;
}
.rte-pro-sticky .rte-toolbar { position: sticky; top: 0; z-index: 40; }
.rte-toolbar .rte-sep {
  width: 1px; height: 26px;
  background: var(--rte-border);
  margin: 0 4px; flex-shrink: 0;
}
.rte-btn {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 32px; height: 32px; padding: 0 5px;
  border: none; border-radius: 6px; background: transparent;
  cursor: pointer; font-size: 18px; line-height: 1;
  transition: background .15s, transform .1s;
  position: relative; color: #334155;
}
.rte-btn:hover { background: var(--rte-hover); transform: scale(1.08); z-index: 10; }
.rte-btn:active { background: var(--rte-active); transform: scale(.96); }
.rte-btn.active {
  background: var(--rte-accent); color: #fff;
  transform: scale(.96); box-shadow: 0 1px 4px rgba(99,102,241,.35);
}
.rte-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 2; stroke-linecap: round; }
.rte-btn.active svg { stroke: #fff; }
.rte-btn-text { font-size: 15px; font-weight: 700; font-family: Georgia, "Times New Roman", serif; min-width: 30px; }
.rte-btn-text.fmt-bold { font-weight: 900; }
.rte-btn-text.fmt-italic { font-style: italic; }
.rte-btn-text.fmt-underline { text-decoration: underline; text-underline-offset: 2px; }
.rte-btn-text.fmt-strike { text-decoration: line-through; }
.rte-btn-text.fmt-sub { font-size: 13px; }
.rte-btn-text.fmt-sup { font-size: 13px; }
.rte-btn[data-tip]::after, .rte-tip[data-tip]::after {
  content: attr(data-tip); position: absolute; top: calc(100% + 6px); left: 50%;
  transform: translateX(-50%) scale(.9); background: #1e293b; color: #fff;
  font-size: 11px; font-weight: 400; font-style: normal; text-decoration: none;
  padding: 4px 10px; border-radius: 5px; white-space: nowrap; pointer-events: none;
  opacity: 0; transition: opacity .18s, transform .18s; z-index: 10000;
  font-family: var(--rte-font); box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.rte-btn:hover[data-tip]::after, .rte-tip:hover[data-tip]::after { opacity: 1; transform: translateX(-50%) scale(1); }
.rte-tip { position: relative; display: inline-flex; align-items: center; }
.rte-tip:hover { z-index: 10; }
.rte-select {
  height: 32px; padding: 0 8px; border: 1px solid var(--rte-border);
  border-radius: 6px; background: var(--rte-bg); font-family: var(--rte-font);
  font-size: 13px; cursor: pointer; outline: none;
}
.rte-select:hover { border-color: #94a3b8; }
.rte-color-wrap { position: relative; display: inline-flex; align-items: center; }
.rte-color-wrap input[type="color"] {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0; cursor: pointer; border: none; padding: 0;
}
.rte-content {
  min-height: 260px; overflow: auto; resize: vertical;
  padding: 16px 20px; outline: none; font-size: 15px;
  line-height: 1.7; color: #1e293b; caret-color: var(--rte-accent);
}
.rte-content:empty::before { content: attr(data-placeholder); color: #94a3b8; pointer-events: none; display: block; }
.rte-content h1 { font-size: 2em; margin: .4em 0; }
.rte-content h2 { font-size: 1.5em; margin: .35em 0; }
.rte-content h3 { font-size: 1.25em; margin: .3em 0; }
.rte-content h4 { font-size: 1.1em; margin: .25em 0; }
.rte-content p { margin: .3em 0; }
.rte-content blockquote { border-left: 4px solid var(--rte-accent); margin: .6em 0; padding: .4em .8em; background: #f1f5f9; border-radius: 0 6px 6px 0; }
.rte-content pre { background: #1e293b; color: #e2e8f0; padding: 12px 16px; border-radius: 8px; overflow-x: auto; font-family: "Fira Code", Consolas, monospace; font-size: 13px; }
.rte-content img, .rte-content video, .rte-content audio { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; display: block; }
.rte-content table { border-collapse: collapse; width: 100%; margin: 8px 0; }
.rte-content table td, .rte-content table th { border: 1px solid var(--rte-border); padding: 8px 12px; text-align: left; min-width: 60px; }
.rte-content table th { background: var(--rte-toolbar-bg); font-weight: 600; }
.rte-content.rte-col-resize, .rte-content.rte-col-resize * { cursor: col-resize !important; }
.rte-content.rte-row-resize, .rte-content.rte-row-resize * { cursor: row-resize !important; }
.rte-content.rte-table-resizing { user-select: none; -webkit-user-select: none; }
.rte-ctx-menu { min-width: 180px; z-index: 99999; background: #fff !important; border: 1px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 30px rgba(0,0,0,.13); padding: 6px; }
.rte-ctx-item { padding: 6px 12px; cursor: pointer; font-size: 13px; border-radius: 4px; white-space: nowrap; }
.rte-ctx-item:hover { background: var(--rte-hover); }
.rte-ctx-sep { height: 1px; background: var(--rte-border); margin: 4px 0; }
.rte-drag-handle { position: absolute; left: 2px; cursor: grab; z-index: 10; font-size: 10px; color: #94a3b8; user-select: none; opacity: 0; transition: opacity .15s; padding: 2px; border-radius: 3px; line-height: 1; }
.rte-drag-handle:hover { opacity: 1 !important; background: #f1f5f9; color: #64748b; }
.rte-dragging { opacity: 0.3 !important; }
.rte-drop-line { height: 3px; background: #6366f1; border: none; border-radius: 2px; margin: -2px 0; pointer-events: none; }
.rte-content a { color: var(--rte-accent); text-decoration: underline; }
.rte-content hr { border: none; border-top: 2px dashed var(--rte-border); margin: 1em 0; }
.rte-content ul, .rte-content ol { padding-left: 1.6em; margin: .4em 0; }
.rte-popup {
  position: absolute; z-index: 50; background: var(--rte-bg);
  border: 1px solid var(--rte-border); border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,.13); padding: 12px 14px;
  display: none; min-width: 220px;
}
.rte-popup.show { display: block; animation: rtePopIn .2s ease; }
@keyframes rtePopIn { from { opacity: 0; transform: translateY(6px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
.rte-popup label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; }
.rte-popup input[type="text"], .rte-popup input[type="url"], .rte-popup input[type="number"] {
  width: 100%; padding: 6px 10px; border: 1px solid var(--rte-border);
  border-radius: 6px; font-size: 13px; font-family: var(--rte-font); outline: none; margin-bottom: 8px;
}
.rte-popup input:focus { border-color: var(--rte-accent); box-shadow: 0 0 0 2px rgba(99,102,241,.18); }
.rte-popup-actions { display: flex; gap: 6px; justify-content: flex-end; }
.rte-popup-btn {
  padding: 5px 14px; border: none; border-radius: 6px;
  font-size: 13px; font-family: var(--rte-font); cursor: pointer; font-weight: 500;
}
.rte-popup-btn.primary { background: var(--rte-accent); color: #fff; }
.rte-popup-btn.primary:hover { background: #4f46e5; }
.rte-popup-btn.secondary { background: #e2e8f0; color: #334155; }
.rte-popup-btn.secondary:hover { background: #cbd5e1; }
.rte-swatches { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-top: 6px; }
.rte-swatch { width: 24px; height: 24px; border-radius: 50%; border: 2px solid transparent; cursor: pointer; transition: transform .12s, border-color .12s; }
.rte-swatch:hover { transform: scale(1.22); border-color: var(--rte-accent); }
.rte-emoji-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 2px; max-height: 200px; overflow-y: auto; margin-top: 6px; }
.rte-emoji-item { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: none; background: none; border-radius: 6px; cursor: pointer; transition: background .12s, transform .12s; }
.rte-emoji-item:hover { background: var(--rte-hover); transform: scale(1.15); }
.rte-table-grid { display: grid; grid-template-columns: repeat(6, 24px); gap: 3px; margin-top: 6px; }
.rte-table-cell { width: 24px; height: 24px; border: 1px solid var(--rte-border); border-radius: 3px; cursor: pointer; transition: background .1s; }
.rte-table-cell:hover, .rte-table-cell.highlight { background: #c7d2fe; border-color: var(--rte-accent); }
.rte-table-size { font-size: 12px; color: #64748b; margin-top: 4px; text-align: center; }
.rte-exportbar { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px; background: var(--rte-toolbar-bg); border-top: 1px solid var(--rte-border); align-items: center; user-select: none; }
.rte-export-btn { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: 1px solid var(--rte-border); border-radius: 6px; background: var(--rte-bg); font-family: var(--rte-font); font-size: 12px; font-weight: 500; color: #334155; cursor: pointer; transition: background .15s, border-color .15s, transform .1s; white-space: nowrap; }
.rte-export-btn:hover { background: var(--rte-hover); border-color: #94a3b8; transform: scale(1.03); }
.rte-export-btn:active { transform: scale(.97); }
.rte-export-btn .rte-export-icon { font-size: 14px; }
.rte-filename-input { padding: 4px 8px; border: 1px solid var(--rte-border); border-radius: 6px; font-family: var(--rte-font); font-size: 12px; color: #334155; background: var(--rte-bg); width: 150px; outline: none; margin-right: 2px; }
.rte-filename-input:focus { border-color: #60a5fa; box-shadow: 0 0 0 2px rgba(96,165,250,0.2); }
.rte-filename-input::placeholder { color: #94a3b8; }
.rte-toast { position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%) translateY(8px); background: #1e293b; color: #fff; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-family: var(--rte-font); pointer-events: none; opacity: 0; transition: opacity .2s, transform .2s; z-index: 60; white-space: nowrap; }
.rte-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.rte-statusbar { display: flex; justify-content: space-between; gap: 12px; padding: 4px 12px; font-size: 11px; color: #94a3b8; background: var(--rte-toolbar-bg); border-top: 1px solid var(--rte-border); flex-wrap: wrap; }
.rte-wrap input[type="file"] { display: none; }
.rte-img-resize-overlay { position: absolute; border: 2px solid #3b82f6; pointer-events: none; z-index: 10; }
.rte-img-resize-handle { position: absolute; width: 10px; height: 10px; background: #3b82f6; border: 1px solid #fff; border-radius: 2px; pointer-events: auto; z-index: 11; }
.rte-img-resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.rte-img-resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.rte-img-resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.rte-img-resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
.rte-img-resizing { outline: 2px solid #3b82f6; outline-offset: 1px; }
/* ── RTEPro-specific ── */
.rte-pro-fullscreen { position: fixed; inset: 0; z-index: 9999; border-radius: 0; max-width: none; }
.rte-pro-fullscreen .rte-content { height: calc(100vh - 200px); max-height: none; }
.rte-pro-source { width: 100%; min-height: 300px; font-family: "Fira Code", Consolas, monospace; font-size: 13px; padding: 16px 20px; border: none; outline: none; resize: vertical; background: var(--rte-bg); color: #1e293b; line-height: 1.7; box-sizing: border-box; }
.rte-pro-findbar { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 12px; background: var(--rte-toolbar-bg); border-bottom: 1px solid var(--rte-border); align-items: center; }
.rte-pro-findbar input { padding: 4px 8px; border: 1px solid var(--rte-border); border-radius: 6px; font-size: 13px; font-family: var(--rte-font); outline: none; }
.rte-pro-findbar input:focus { border-color: var(--rte-accent); box-shadow: 0 0 0 2px rgba(99,102,241,.18); }
.rte-pro-match-count { font-size: 11px; color: #64748b; }
.rte-pro-highlight-match { background: #fde68a; }
.rte-pro-highlight-current { background: #f97316; color: #fff; }
.rte-pro-char-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; }
.rte-pro-char-item { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; background: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background .12s, transform .12s; }
.rte-pro-char-item:hover { background: var(--rte-hover); transform: scale(1.15); }
.rte-pro-panel { position: absolute; right: 0; top: 0; bottom: 0; width: 380px; background: #fff; border-left: 1px solid var(--rte-border); z-index: 45; transform: translateX(100%); transition: transform .3s; }
.rte-pro-panel.open { transform: none; }
.rte-pro-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--rte-border); font-weight: 600; }
.rte-pro-panel-body { padding: 16px; overflow-y: auto; max-height: calc(100% - 52px); }
.rte-pro-ai-response { background: #f8f9fb; border-radius: 8px; padding: 12px; margin: 8px 0; white-space: pre-wrap; font-size: 14px; max-height: 400px; overflow-y: auto; }
.rte-pro-ai-actions { display: flex; gap: 6px; margin-top: 8px; }
.rte-pro-ai-status { font-size: 11px; }
.rte-pro-watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 48px; color: rgba(0,0,0,.06); pointer-events: none; z-index: 1; font-weight: 700; }
.rte-pro-focus-mode .rte-content p, .rte-pro-focus-mode .rte-content div:not(.rte-pro-toc):not(.rte-pro-footnotes):not(.rte-pro-page-break),
.rte-pro-focus-mode .rte-content h1, .rte-pro-focus-mode .rte-content h2,
.rte-pro-focus-mode .rte-content h3, .rte-pro-focus-mode .rte-content h4,
.rte-pro-focus-mode .rte-content li, .rte-pro-focus-mode .rte-content blockquote,
.rte-pro-focus-mode .rte-content pre { opacity: .3; transition: opacity .2s; }
.rte-pro-focus-mode .rte-content .active-block { opacity: 1; }
.rte-pro-slash-menu { position: absolute; z-index: 55; background: #fff; border: 1px solid var(--rte-border); border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.13); max-height: 240px; overflow-y: auto; min-width: 220px; }
.rte-pro-slash-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; cursor: pointer; font-size: 14px; }
.rte-pro-slash-item:hover { background: var(--rte-hover); }
.rte-pro-slash-item.selected { background: #e8ecf1; }
.rte-pro-slash-icon { width: 28px; font-size: 16px; text-align: center; }
.rte-pro-mention { background: #e0e7ff; color: #4338ca; padding: 1px 4px; border-radius: 4px; font-weight: 500; }
.rte-pro-hashtag { color: #6366f1; font-weight: 500; text-decoration: none; }
.rte-pro-drag-handle { position: absolute; left: -24px; top: 2px; width: 20px; cursor: grab; opacity: 0; transition: opacity .2s; font-size: 14px; color: #94a3b8; user-select: none; }
.rte-content > *:hover > .rte-pro-drag-handle { opacity: 1; }
.rte-pro-dragging { opacity: .5; }
.rte-pro-cols { display: grid; gap: 0; margin: 8px 0; min-height: 60px; }
.rte-pro-cols-2 { grid-template-columns: 1fr 6px 1fr; }
.rte-pro-cols-3 { grid-template-columns: 1fr 6px 1fr 6px 1fr; }
.rte-pro-col { padding: 12px; outline: none; border: 1px solid var(--rte-border); border-radius: 4px; min-height: 60px; }
.rte-pro-col-handle { cursor: col-resize; background: transparent; position: relative; display: flex; align-items: center; justify-content: center; }
.rte-pro-col-handle::after { content: ""; width: 2px; height: 32px; background: #cbd5e1; border-radius: 1px; transition: background .15s, height .15s; }
.rte-pro-col-handle:hover::after, .rte-pro-col-handle.active::after { background: #6366f1; height: 48px; }
.rte-pro-page-break { border-top: 2px dashed #94a3b8; margin: 16px 0; page-break-after: always; position: relative; }
.rte-pro-page-break::after { content: "Page Break"; position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--rte-bg); padding: 0 8px; font-size: 11px; color: #94a3b8; }
.rte-pro-version-item { padding: 10px 12px; border-bottom: 1px solid var(--rte-border); cursor: pointer; }
.rte-pro-version-item:hover { background: var(--rte-hover); }
.rte-pro-version-date { font-size: 11px; color: #64748b; }
.rte-pro-progress { height: 4px; background: #e2e8f0; border-radius: 2px; overflow: hidden; }
.rte-pro-progress-fill { height: 100%; background: var(--rte-accent); transition: width .3s; }
.rte-pro-footnote-ref { color: var(--rte-accent); cursor: pointer; font-size: smaller; vertical-align: super; }
.rte-pro-footnotes { border-top: 1px solid var(--rte-border); margin-top: 24px; padding-top: 12px; font-size: 13px; }
.rte-pro-toc { background: #f8f9fb; padding: 16px; border-radius: 8px; margin: 12px 0; }
.rte-pro-toc a { display: block; padding: 2px 0; text-decoration: none; color: var(--rte-accent); }
.rte-pro-toc .toc-h2 { padding-left: 16px; }
.rte-pro-toc .toc-h3 { padding-left: 32px; }
.rte-pro-toc .toc-h4 { padding-left: 48px; }
.rte-pro-kw { color: #c678dd; }
.rte-pro-str { color: #98c379; }
.rte-pro-cmt { color: #5c6370; font-style: italic; }
.rte-pro-num { color: #d19a66; }
/* Gridlines / element outlines */
.rte-pro-gridlines .rte-content p,
.rte-pro-gridlines .rte-content div:not(.rte-pro-toc):not(.rte-pro-footnotes):not(.rte-pro-page-break):not(.rte-pro-watermark),
.rte-pro-gridlines .rte-content h1, .rte-pro-gridlines .rte-content h2,
.rte-pro-gridlines .rte-content h3, .rte-pro-gridlines .rte-content h4,
.rte-pro-gridlines .rte-content h5, .rte-pro-gridlines .rte-content h6,
.rte-pro-gridlines .rte-content ul, .rte-pro-gridlines .rte-content ol,
.rte-pro-gridlines .rte-content li,
.rte-pro-gridlines .rte-content blockquote,
.rte-pro-gridlines .rte-content pre,
.rte-pro-gridlines .rte-content table,
.rte-pro-gridlines .rte-content td, .rte-pro-gridlines .rte-content th,
.rte-pro-gridlines .rte-content img, .rte-pro-gridlines .rte-content video,
.rte-pro-gridlines .rte-content audio,
.rte-pro-gridlines .rte-content hr,
.rte-pro-gridlines .rte-content span[style],
.rte-pro-gridlines .rte-content a {
  outline: 1px dashed rgba(99,102,241,.35);
  outline-offset: 1px;
}
.rte-pro-gridlines .rte-content p::before,
.rte-pro-gridlines .rte-content h1::before, .rte-pro-gridlines .rte-content h2::before,
.rte-pro-gridlines .rte-content h3::before, .rte-pro-gridlines .rte-content h4::before,
.rte-pro-gridlines .rte-content blockquote::before,
.rte-pro-gridlines .rte-content pre::before,
.rte-pro-gridlines .rte-content ul::before, .rte-pro-gridlines .rte-content ol::before,
.rte-pro-gridlines .rte-content li::before,
.rte-pro-gridlines .rte-content table::before {
  content: attr(data-rte-tag);
  position: absolute;
  top: -1px; left: -1px;
  font-size: 9px;
  line-height: 1;
  padding: 1px 4px;
  background: rgba(99,102,241,.75);
  color: #fff;
  border-radius: 0 0 4px 0;
  pointer-events: none;
  font-family: var(--rte-font);
  font-weight: 500;
  font-style: normal;
  text-transform: uppercase;
  z-index: 2;
}
.rte-pro-gridlines .rte-content p,
.rte-pro-gridlines .rte-content h1, .rte-pro-gridlines .rte-content h2,
.rte-pro-gridlines .rte-content h3, .rte-pro-gridlines .rte-content h4,
.rte-pro-gridlines .rte-content blockquote,
.rte-pro-gridlines .rte-content pre,
.rte-pro-gridlines .rte-content ul, .rte-pro-gridlines .rte-content ol,
.rte-pro-gridlines .rte-content li,
.rte-pro-gridlines .rte-content table { position: relative; }
/* Checklists */
.rte-content ul.rte-checklist { list-style: none; padding-left: 4px; }
.rte-content ul.rte-checklist li {
  display: flex; align-items: flex-start; gap: 8px; padding: 2px 0; cursor: pointer;
}
.rte-content ul.rte-checklist li::before {
  content: ""; display: inline-block; width: 18px; height: 18px; min-width: 18px;
  margin-top: 3px; border: 2px solid #94a3b8; border-radius: 4px;
  background: #fff; cursor: pointer; transition: background .15s, border-color .15s;
}
.rte-content ul.rte-checklist li.checked::before {
  background: var(--rte-accent); border-color: var(--rte-accent);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 8l3 3 5-6' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-size: 14px; background-position: center; background-repeat: no-repeat;
}
.rte-content ul.rte-checklist li.checked { text-decoration: line-through; color: #94a3b8; }
/* Floating / Bubble Toolbar */
.rte-bubble-toolbar {
  position: absolute; display: flex; align-items: center; gap: 2px;
  padding: 4px 6px; background: #1e293b; border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0,0,0,.25); z-index: 9999;
  opacity: 0; transform: translateY(4px); pointer-events: none;
  transition: opacity .15s, transform .15s;
}
.rte-bubble-toolbar.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
.rte-bubble-toolbar::after {
  content: ""; position: absolute; bottom: -6px; left: 50%; transform: translateX(-50%);
  border-left: 6px solid transparent; border-right: 6px solid transparent;
  border-top: 6px solid #1e293b;
}
.rte-bubble-toolbar button {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 30px; height: 28px; padding: 0 6px; border: none; border-radius: 5px;
  background: transparent; color: #e2e8f0; cursor: pointer; font-size: 14px;
  font-weight: 600; font-family: Georgia, "Times New Roman", serif;
  transition: background .12s;
}
.rte-bubble-toolbar button:hover { background: rgba(255,255,255,.15); }
/* AI Ghost Text */
.rte-pro-ghost {
  color: #94a3b8; font-style: italic; user-select: none; pointer-events: none;
}
.rte-pro-ghost-hint {
  display: inline-block; margin-left: 6px; padding: 1px 6px; background: #e2e8f0;
  color: #64748b; font-size: 11px; font-style: normal; border-radius: 3px;
  user-select: none; pointer-events: none; vertical-align: middle;
}
@media (max-width: 580px) {
  .rte-btn { min-width: 28px; height: 28px; font-size: 16px; }
  .rte-btn-text { font-size: 13px; }
  .rte-content { padding: 12px 14px; font-size: 14px; }
  .rte-pro-panel { width: 100%; }
}
@media print {
  .rte-toolbar, .rte-exportbar, .rte-statusbar, .rte-pro-panel { display: none !important; }
  .rte-pro-page-break { page-break-after: always; }
}
`;

  function injectCSS() {
    if (document.getElementById("rte-pro-styles")) return;
    const s = document.createElement("style");
    s.id = "rte-pro-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ── Constants ────────────────────────────────────────────
  const COLORS = [
    "#000000","#434343","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#ffffff",
    "#e06666","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79",
    "#cc0000","#e69138","#f1c232","#38761d","#134f5c","#0b5394","#351c75","#741b47",
    "#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff","#9900ff","#ff00ff",
    "#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc",
  ];
  const EMOJIS = [
    "\u{1F600}","\u{1F602}","\u{1F60D}","\u{1F970}","\u{1F60E}","\u{1F929}","\u{1F607}","\u{1F973}",
    "\u{1F622}","\u{1F621}","\u{1F914}","\u{1F631}","\u{1F917}","\u{1F634}","\u{1F92E}","\u{1F97A}",
    "\u{1F44D}","\u{1F44E}","\u{1F44F}","\u{1F64C}","\u{1F4AA}","\u{1F91D}","\u270C\uFE0F","\u{1F91E}",
    "\u2764\uFE0F","\u{1F9E1}","\u{1F49B}","\u{1F49A}","\u{1F499}","\u{1F49C}","\u{1F5A4}","\u{1F90D}",
    "\u2B50","\u{1F31F}","\u2728","\u{1F4AB}","\u{1F525}","\u{1F4AF}","\u{1F389}","\u{1F38A}",
    "\u2705","\u274C","\u26A0\uFE0F","\u{1F4A1}","\u{1F3AF}","\u{1F3C6}","\u{1F381}","\u{1F4CC}",
    "\u{1F680}","\u{1F308}","\u2600\uFE0F","\u{1F319}","\u{1F30E}","\u{1F355}","\u{1F3B5}","\u{1F4F7}",
  ];
  const FONTS = [
    ["Default",""],["Arial","Arial, sans-serif"],["Georgia","Georgia, serif"],
    ["Times New Roman","'Times New Roman', serif"],["Courier New","'Courier New', monospace"],
    ["Verdana","Verdana, sans-serif"],["Trebuchet MS","'Trebuchet MS', sans-serif"],
    ["Comic Sans MS","'Comic Sans MS', cursive"],["Impact","Impact, sans-serif"],
  ];
  const SPECIAL_CHARS = {
    Currency: "$\u00A2\u00A3\u00A5\u20AC\u20B9\u20BD\u20A9\u20BF\u00A4",
    Math: "\u00B1\u00D7\u00F7\u2260\u2248\u2264\u2265\u221E\u2211\u220F\u222B\u221A\u2202\u2206\u2207",
    Arrows: "\u2190\u2192\u2191\u2193\u2194\u2195\u21D0\u21D2\u21D1\u21D3\u21D4",
    Greek: "\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03BB\u03BC\u03C0\u03C1\u03C3\u03C6\u03C9\u03A9",
    Symbols: "\u00A9\u00AE\u2122\u00B0\u2022\u2026\u2020\u2021\u00A7\u00B6",
    Punctuation: "\u2013\u2014\u2018\u2019\u201C\u201D\u00AB\u00BB\u2039\u203A\u00A1\u00BF",
  };
  const SLASH_COMMANDS = [
    { cmd:"heading1", icon:"H1", label:"Heading 1", description:"Large heading" },
    { cmd:"heading2", icon:"H2", label:"Heading 2", description:"Medium heading" },
    { cmd:"heading3", icon:"H3", label:"Heading 3", description:"Small heading" },
    { cmd:"paragraph", icon:"\u00B6", label:"Paragraph", description:"Plain text block" },
    { cmd:"bulletList", icon:"\u2022", label:"Bullet List", description:"Unordered list" },
    { cmd:"numberedList", icon:"1.", label:"Numbered List", description:"Ordered list" },
    { cmd:"blockquote", icon:"\u201C", label:"Blockquote", description:"Quote block" },
    { cmd:"codeBlock", icon:"<>", label:"Code Block", description:"Monospace code block" },
    { cmd:"horizontalRule", icon:"\u2014", label:"Horizontal Rule", description:"Divider line" },
    { cmd:"table", icon:"\u25A6", label:"Table", description:"Insert a table" },
    { cmd:"image", icon:"\u{1F5BC}", label:"Image", description:"Insert an image" },
    { cmd:"pageBreak", icon:"\u2702", label:"Page Break", description:"Insert page break" },
    { cmd:"toc", icon:"\u{1F4D1}", label:"Table of Contents", description:"Auto-generated TOC" },
    { cmd:"footnote", icon:"\u00B9", label:"Footnote", description:"Add a footnote" },
    { cmd:"columns2", icon:"\u2016", label:"2 Columns", description:"Two-column layout" },
    { cmd:"columns3", icon:"\u2AF6", label:"3 Columns", description:"Three-column layout" },
    { cmd:"checklist", icon:"\u2611", label:"Checklist", description:"Interactive checklist" },
  ];
  const AI_TONES = ["Professional","Casual","Academic","Creative","Concise"];
  const AI_LANGUAGES = ["Spanish","French","German","Italian","Portuguese","Chinese","Japanese","Korean","Arabic","Hindi"];

  // ── Helpers ──────────────────────────────────────────────
  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (tag === "button") e.type = "button";
    if (attrs) Object.entries(attrs).forEach(([k, v]) => {
      if (k === "className") e.className = v;
      else if (k === "style" && typeof v === "object") Object.assign(e.style, v);
      else if (k.startsWith("on")) e.addEventListener(k.slice(2).toLowerCase(), v);
      else e.setAttribute(k, v);
    });
    if (children) {
      if (typeof children === "string") e.innerHTML = children;
      else if (Array.isArray(children)) children.forEach(c => { if (c) e.appendChild(c); });
      else e.appendChild(children);
    }
    return e;
  }
  function btn(emoji, tip, onClick, extraClass) {
    return el("button", { type:"button", className:"rte-btn" + (extraClass ? " " + extraClass : ""), "data-tip":tip, onClick }, emoji);
  }
  function fmtBtn(label, tip, onClick, fmtClass) {
    return el("button", { type:"button", className:"rte-btn rte-btn-text " + fmtClass, "data-tip":tip, onClick }, label);
  }
  function sep() { return el("span", { className:"rte-sep" }); }
  function tipWrap(child, tip) { const w = el("span", { className:"rte-tip", "data-tip":tip }); w.appendChild(child); return w; }
  function alignIcon(type) {
    const lines = { left:[3,14,3,11,3,8], center:[5,13,3,15,5,13], right:[5,15,3,15,5,15], justify:[3,15,3,15,3,15] };
    const y = [4, 9, 14]; const l = lines[type];
    return '<svg viewBox="0 0 18 18"><line x1="'+l[0]+'" y1="'+y[0]+'" x2="'+l[1]+'" y2="'+y[0]+'"/><line x1="'+l[2]+'" y1="'+y[1]+'" x2="'+l[3]+'" y2="'+y[1]+'"/><line x1="'+l[4]+'" y1="'+y[2]+'" x2="'+l[5]+'" y2="'+y[2]+'"/></svg>';
  }
  function saveSelection() { const sel = window.getSelection(); if (sel.rangeCount > 0) return sel.getRangeAt(0).cloneRange(); return null; }
  function restoreSelection(range) { if (!range) return; const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range); }
  function debounce(fn, ms) { let t; return function() { const a = arguments, c = this; clearTimeout(t); t = setTimeout(() => fn.apply(c, a), ms); }; }
  const BLOCK_TAGS = ["P","H1","H2","H3","H4","H5","H6","DIV","BLOCKQUOTE","PRE","LI","TABLE","UL","OL"];
  function getContainingBlock(node, container) {
    let cur = node;
    while (cur && cur !== container) {
      if (cur.nodeType === 1 && BLOCK_TAGS.indexOf(cur.tagName) !== -1) return cur;
      cur = cur.parentNode;
    }
    return null;
  }
  function getTopLevelBlock(node, container) {
    let cur = node, prev = null;
    while (cur && cur !== container) { prev = cur; cur = cur.parentNode; }
    return cur === container ? prev : null;
  }
  function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, "");
    if (!word) return 0; if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
    var m = word.match(/[aeiouy]{1,2}/g);
    return m ? m.length : 1;
  }

  // ── Build Editor ─────────────────────────────────────────
  function init(selector, options) {
    injectCSS();
    const target = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!target) { console.error("RTEPro: target not found", selector); return null; }

    options = Object.assign({
      placeholder: "Start typing something amazing\u2026",
      height: null, exportCSS: null, exportTemplate: null,
      apiKey: null, aiProxy: null, aiModel: "claude-sonnet-4-5-20250929", aiProvider: "anthropic",
      toolbar: null, autosave: false, autosaveKey: "rte-pro-autosave",
      wordGoal: 0, charGoal: 0, spellcheck: true, direction: "ltr",
      mentions: [], hashtagUrl: null, printMargins: null,
      watermark: null, stickyToolbar: true, focusMode: false, maxVersions: 20,
      aiAutocomplete: false,
    }, options);

    const wrap = el("div", { className: "rte-wrap" + (options.stickyToolbar ? " rte-pro-sticky" : "") });
    const toolbar = el("div", { className: "rte-toolbar" });
    const content = el("div", {
      className: "rte-content", contenteditable: "true",
      "data-placeholder": options.placeholder,
      spellcheck: String(options.spellcheck), dir: options.direction,
    });
    if (options.height) content.style.minHeight = options.height;

    const statusbar = el("div", { className: "rte-statusbar" });
    const wordCountEl = el("span", {}, "\u{1F4DD} Words: 0");
    const charCountEl = el("span", {}, "\u{1F524} Chars: 0");
    const readingTimeEl = el("span", {}, "\u{1F4D6} ~0 min read");
    const aiStatusEl = el("span", { className: "rte-pro-ai-status" }, (options.apiKey || options.aiProxy) ? "AI: Ready" : "AI: No key");
    if (options.apiKey || options.aiProxy) aiStatusEl.style.color = "#22c55e";
    statusbar.append(wordCountEl, charCountEl, readingTimeEl, aiStatusEl);

    const formatButtons = {};
    function exec(cmd, val) { content.focus(); document.execCommand(cmd, false, val || null); updateStatus(); updateActiveStates(); }
    function updateActiveStates() {
      const cmds = { bold:"bold", italic:"italic", underline:"underline", strikeThrough:"strike", superscript:"sup", subscript:"sub" };
      Object.entries(cmds).forEach(([cmd, key]) => { if (formatButtons[key]) formatButtons[key].classList.toggle("active", document.queryCommandState(cmd)); });
    }

    // ── Selects ──
    const headingSelect = el("select", { className:"rte-select", "aria-label":"Block format" });
    [["\u00B6 Paragraph","p"],["\u{1F4CC} H1 \u2014 Title","h1"],["\u{1F4CC} H2 \u2014 Section","h2"],["\u{1F4CC} H3 \u2014 Subsection","h3"],["\u{1F4CC} H4 \u2014 Detail","h4"]].forEach(([l,v]) => headingSelect.appendChild(el("option", { value:v }, l)));
    headingSelect.addEventListener("change", () => exec("formatBlock", "<" + headingSelect.value + ">"));

    const fontSelect = el("select", { className:"rte-select", "aria-label":"Font family" });
    FONTS.forEach(([l,v]) => { const o = el("option", { value:v }, l); if (v) o.style.fontFamily = v; fontSelect.appendChild(o); });
    fontSelect.addEventListener("change", () => { if (fontSelect.value) exec("fontName", fontSelect.value); });

    const sizeSelect = el("select", { className:"rte-select", "aria-label":"Font size" });
    [["\u{1F524} Size",""],["1 Tiny","1"],["2 Small","2"],["3 Normal","3"],["4 Medium","4"],["5 Large","5"],["6 Huge","6"],["7 Max","7"]].forEach(([l,v]) => sizeSelect.appendChild(el("option", { value:v }, l)));
    sizeSelect.addEventListener("change", () => { if (sizeSelect.value) exec("fontSize", sizeSelect.value); });

    const lineSpacingSelect = el("select", { className:"rte-select", "aria-label":"Line spacing" });
    [["Line Spacing",""],["1.0","1"],["1.2","1.2"],["1.4","1.4"],["1.5","1.5"],["1.6","1.6"],["1.8","1.8"],["2.0","2"],["2.5","2.5"],["3.0","3"]].forEach(([l,v]) => lineSpacingSelect.appendChild(el("option", { value:v }, l)));
    lineSpacingSelect.addEventListener("change", () => { const b = getContainingBlock(window.getSelection().anchorNode, content); if (b && lineSpacingSelect.value) b.style.lineHeight = lineSpacingSelect.value; });

    const letterSpacingSelect = el("select", { className:"rte-select", "aria-label":"Letter spacing" });
    [["Letter Spacing",""],["Normal","normal"],["Tight","-0.5px"],["Wide","1px"],["Extra Wide","2px"],["Ultra Wide","4px"]].forEach(([l,v]) => letterSpacingSelect.appendChild(el("option", { value:v }, l)));
    letterSpacingSelect.addEventListener("change", () => { const b = getContainingBlock(window.getSelection().anchorNode, content); if (b && letterSpacingSelect.value) b.style.letterSpacing = letterSpacingSelect.value; });

    // ── Color popups ──
    function buildColorPopup(title, onPick) {
      const popup = el("div", { className:"rte-popup" });
      popup.addEventListener("mousedown", e => { if (e.target.tagName !== "INPUT") e.preventDefault(); });
      popup.appendChild(el("label", {}, title));
      const grid = el("div", { className:"rte-swatches" });
      COLORS.forEach(c => {
        grid.appendChild(el("div", { className:"rte-swatch", title:c, style:{ background:c, border: c==="#ffffff"?"2px solid #d0d5dd":"2px solid transparent" }, onClick:() => { onPick(c); popup.classList.remove("show"); } }));
      });
      popup.appendChild(grid);
      const customRow = el("div", { style:{ marginTop:"8px", display:"flex", gap:"6px", alignItems:"center" } });
      const ci = el("input", { type:"text", placeholder:"#hex or color name", style:{ flex:"1" } });
      customRow.append(ci, el("button", { className:"rte-popup-btn primary", onClick:() => { if (ci.value) { onPick(ci.value); popup.classList.remove("show"); } } }, "Apply"));
      popup.appendChild(customRow);
      return popup;
    }

    let savedRange = null;
    const allPopups = [];
    const textColorPopup = buildColorPopup("\u{1F3A8} Text Color", c => { restoreSelection(savedRange); exec("foreColor", c); }); allPopups.push(textColorPopup);
    const bgColorPopup = buildColorPopup("\u{1F58D}\uFE0F Highlight Color", c => { restoreSelection(savedRange); exec("hiliteColor", c); }); allPopups.push(bgColorPopup);
    const blockBgPopup = buildColorPopup("\u{1F3A8} Block Background", c => { restoreSelection(savedRange); const b = getContainingBlock(window.getSelection().anchorNode, content); if (b) b.style.backgroundColor = c; }); allPopups.push(blockBgPopup);
    const editorBgPopup = buildColorPopup("Editor Background", c => { content.style.backgroundColor = c; }); allPopups.push(editorBgPopup);

    // ── Link popup ──
    const linkPopup = el("div", { className:"rte-popup" });
    linkPopup.innerHTML = '<label>\u{1F517} Insert Link</label><input type="text" class="rte-link-text" placeholder="Link Text"><input type="url" class="rte-link-url" placeholder="https://example.com"><div class="rte-popup-actions"><button class="rte-popup-btn secondary rte-link-cancel">Cancel</button><button class="rte-popup-btn primary rte-link-ok">Insert</button></div>';
    allPopups.push(linkPopup);

    // ── Media popups ──
    function buildMediaPopup(label, accept, embedFn) {
      const popup = el("div", { className:"rte-popup" });
      const urlInput = el("input", { type:"url", placeholder:"https://..." });
      const fileInput = el("input", { type:"file", accept });
      const fileBtn = el("button", { className:"rte-popup-btn secondary", onClick:() => fileInput.click() }, "\u{1F4C2} Choose File");
      const okBtn = el("button", { className:"rte-popup-btn primary", onClick:() => { if (urlInput.value) { restoreSelection(savedRange); embedFn(urlInput.value); popup.classList.remove("show"); urlInput.value=""; } } }, "Insert");
      const cancelBtn = el("button", { className:"rte-popup-btn secondary", onClick:() => popup.classList.remove("show") }, "Cancel");
      fileInput.addEventListener("change", () => { const f = fileInput.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { restoreSelection(savedRange); embedFn(r.result); popup.classList.remove("show"); }; r.readAsDataURL(f); });
      const actions = el("div", { className:"rte-popup-actions" }); actions.append(cancelBtn, okBtn);
      popup.append(el("label", {}, label + " \u2014 paste URL or upload file"), urlInput, el("div", { style:{ margin:"6px 0", display:"flex", gap:"6px" } }, [fileBtn]), actions);
      allPopups.push(popup); return popup;
    }
    const imagePopup = buildMediaPopup("\u{1F5BC}\uFE0F Image", "image/*", src => exec("insertHTML", '<img src="'+src+'" alt="image">'));
    const videoPopup = buildMediaPopup("\u{1F3AC} Video", "video/*", src => exec("insertHTML", '<video src="'+src+'" controls></video>'));
    const audioPopup = buildMediaPopup("\u{1F50A} Audio", "audio/*", src => exec("insertHTML", '<audio src="'+src+'" controls></audio>'));

    // ── Emoji popup ──
    const emojiPopup = el("div", { className:"rte-popup" }); emojiPopup.appendChild(el("label", {}, "\u{1F600} Insert Emoji"));
    const emojiGrid = el("div", { className:"rte-emoji-grid" });
    EMOJIS.forEach(em => emojiGrid.appendChild(el("button", { className:"rte-emoji-item", title:"Insert "+em, onClick:() => { restoreSelection(savedRange); exec("insertHTML", em); emojiPopup.classList.remove("show"); } }, em)));
    emojiPopup.appendChild(emojiGrid); allPopups.push(emojiPopup);

    // ── Table popup ──
    const tablePopup = el("div", { className:"rte-popup" }); tablePopup.appendChild(el("label", {}, "\u{1F4CA} Insert Table"));
    const tableGrid = el("div", { className:"rte-table-grid" }); const tableSizeLabel = el("div", { className:"rte-table-size" }, "Select size");
    let tRows = 0, tCols = 0; const tableCells = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const cell = el("div", { className:"rte-table-cell", title:(r+1)+"\u00D7"+(c+1), onMouseenter:() => { tRows=r+1; tCols=c+1; tableSizeLabel.textContent=tRows+"\u00D7"+tCols; tableCells.forEach(({el:ce,r:cr,c:cc}) => ce.classList.toggle("highlight", cr<=r && cc<=c)); },
        onClick:() => { restoreSelection(savedRange); let h="<table><tbody>"; for (let ri=0;ri<tRows;ri++){h+="<tr>";for(let ci=0;ci<tCols;ci++)h+=ri===0?"<th>&nbsp;</th>":"<td>&nbsp;</td>";h+="</tr>";}h+="</tbody></table><p><br></p>"; exec("insertHTML",h); tablePopup.classList.remove("show"); } });
      tableCells.push({ el:cell, r, c }); tableGrid.appendChild(cell);
    }
    tablePopup.append(tableGrid, tableSizeLabel); allPopups.push(tablePopup);

    // ── Special chars popup ──
    const specialCharPopup = el("div", { className:"rte-popup", style:{ minWidth:"320px" } }); specialCharPopup.appendChild(el("label", {}, "\u270F\uFE0F Special Characters"));
    const charTabs = el("div", { style:{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"8px" } });
    const charGrid = el("div", { className:"rte-pro-char-grid" }); const charCategories = Object.keys(SPECIAL_CHARS);
    function showCharCategory(cat) { charGrid.innerHTML = ""; Array.from(SPECIAL_CHARS[cat]).forEach(ch => charGrid.appendChild(el("button", { className:"rte-pro-char-item", title:ch+" (U+"+ch.codePointAt(0).toString(16).toUpperCase().padStart(4,"0")+")", onClick:() => { restoreSelection(savedRange); exec("insertHTML", ch); specialCharPopup.classList.remove("show"); } }, ch))); }
    charCategories.forEach((cat, i) => charTabs.appendChild(el("button", { className:"rte-popup-btn "+(i===0?"primary":"secondary"), onClick:e => { charTabs.querySelectorAll("button").forEach(b => b.className="rte-popup-btn secondary"); e.target.className="rte-popup-btn primary"; showCharCategory(cat); } }, cat)));
    specialCharPopup.append(charTabs, charGrid); showCharCategory(charCategories[0]); allPopups.push(specialCharPopup);

    // ── Style popups ──
    const textShadowPopup = el("div", { className:"rte-popup" }); textShadowPopup.appendChild(el("label", {}, "Text Shadow"));
    const tsX = el("input", { type:"number", value:"1", style:{ width:"60px" } }); const tsY = el("input", { type:"number", value:"1", style:{ width:"60px" } });
    const tsBlur = el("input", { type:"number", value:"2", style:{ width:"60px" } }); const tsColor = el("input", { type:"color", value:"#000000", style:{ width:"40px",height:"28px",padding:"0",border:"none",cursor:"pointer" } });
    const tsRow = el("div", { style:{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px" } }); tsRow.append(el("span",{},"X:"),tsX,el("span",{},"Y:"),tsY,el("span",{},"B:"),tsBlur,tsColor);
    textShadowPopup.appendChild(tsRow);
    textShadowPopup.appendChild(el("div", { className:"rte-popup-actions" }, [
      el("button", { className:"rte-popup-btn secondary", onClick:() => { const b=getContainingBlock(window.getSelection().anchorNode,content); if(b)b.style.textShadow=""; textShadowPopup.classList.remove("show"); } }, "Clear"),
      el("button", { className:"rte-popup-btn primary", onClick:() => { restoreSelection(savedRange); const b=getContainingBlock(window.getSelection().anchorNode,content); if(b)b.style.textShadow=tsX.value+"px "+tsY.value+"px "+tsBlur.value+"px "+tsColor.value; textShadowPopup.classList.remove("show"); } }, "Apply"),
    ])); allPopups.push(textShadowPopup);

    const gradientPopup = el("div", { className:"rte-popup" }); gradientPopup.appendChild(el("label", {}, "\u{1F308} Gradient Text"));
    const gC1 = el("input", { type:"color", value:"#6366f1", style:{ width:"40px",height:"28px",padding:"0",border:"none" } });
    const gC2 = el("input", { type:"color", value:"#ec4899", style:{ width:"40px",height:"28px",padding:"0",border:"none" } });
    const gDir = el("select", { className:"rte-select", style:{ fontSize:"12px" } }); ["to right","to left","to bottom","to top","45deg","135deg"].forEach(d => gDir.appendChild(el("option", { value:d }, d)));
    const gRow = el("div", { style:{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px" } }); gRow.append(gC1,gC2,gDir);
    gradientPopup.appendChild(gRow);
    gradientPopup.appendChild(el("div", { className:"rte-popup-actions" }, [
      el("button", { className:"rte-popup-btn secondary", onClick:() => gradientPopup.classList.remove("show") }, "Cancel"),
      el("button", { className:"rte-popup-btn primary", onClick:() => { restoreSelection(savedRange); const sel=window.getSelection(); if(sel.rangeCount&&!sel.isCollapsed) { const frag=sel.getRangeAt(0).cloneContents(), tmp=document.createElement("div"); tmp.appendChild(frag); const h=tmp.innerHTML; exec("insertHTML",'<span style="background:linear-gradient('+gDir.value+','+gC1.value+','+gC2.value+');-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">'+h+'</span>'); } gradientPopup.classList.remove("show"); } }, "Apply"),
    ])); allPopups.push(gradientPopup);

    const bordersPopup = el("div", { className:"rte-popup" }); bordersPopup.appendChild(el("label", {}, "\u25A2 Borders"));
    const bStyle = el("select", { className:"rte-select", style:{ fontSize:"12px" } }); ["none","solid","dashed","dotted","double"].forEach(s => bStyle.appendChild(el("option", { value:s }, s)));
    const bWidth = el("input", { type:"number", value:"1", style:{ width:"50px" }, min:"0", max:"10" });
    const bColor = el("input", { type:"color", value:"#000000", style:{ width:"40px",height:"28px",padding:"0",border:"none" } });
    const bRow = el("div", { style:{ display:"flex", gap:"6px", alignItems:"center", marginBottom:"8px" } }); bRow.append(bStyle, el("span",{},"px:"), bWidth, bColor);
    bordersPopup.appendChild(bRow);
    bordersPopup.appendChild(el("div", { className:"rte-popup-actions" }, [
      el("button", { className:"rte-popup-btn secondary", onClick:() => { const b=getContainingBlock(window.getSelection().anchorNode,content); if(b)b.style.border=""; bordersPopup.classList.remove("show"); } }, "Clear"),
      el("button", { className:"rte-popup-btn primary", onClick:() => { restoreSelection(savedRange); const b=getContainingBlock(window.getSelection().anchorNode,content); if(b)b.style.border=bWidth.value+"px "+bStyle.value+" "+bColor.value; bordersPopup.classList.remove("show"); } }, "Apply"),
    ])); allPopups.push(bordersPopup);

    const anchorPopup = el("div", { className:"rte-popup" }); anchorPopup.appendChild(el("label", {}, "\u2693 Anchor/Bookmark"));
    const anchorInput = el("input", { type:"text", placeholder:"Anchor name" });
    anchorPopup.append(anchorInput, el("div", { className:"rte-popup-actions" }, [
      el("button", { className:"rte-popup-btn secondary", onClick:() => anchorPopup.classList.remove("show") }, "Cancel"),
      el("button", { className:"rte-popup-btn primary", onClick:() => { if(anchorInput.value){ restoreSelection(savedRange); exec("insertHTML",'<a name="'+anchorInput.value+'" id="'+anchorInput.value+'"></a>'); anchorPopup.classList.remove("show"); anchorInput.value=""; } } }, "Insert"),
    ])); allPopups.push(anchorPopup);

    const mathPopup = el("div", { className:"rte-popup" }); mathPopup.appendChild(el("label", {}, "\u2211 Math/LaTeX"));
    const mathInput = el("input", { type:"text", placeholder:"Type expression..." });
    const mathSymbols = el("div", { style:{ display:"flex", flexWrap:"wrap", gap:"2px", margin:"6px 0" } });
    "\u2211\u220F\u222B\u221A\u2202\u2206\u221E\u2260\u2248\u2264\u2265\u00B1\u00D7\u00F7\u03C0\u03B8\u03B1\u03B2\u03B3\u03B4\u03B5".split("").forEach(s => mathSymbols.appendChild(el("button", { className:"rte-pro-char-item", style:{ width:"28px",height:"28px" }, onClick:() => { mathInput.value += s; } }, s)));
    mathPopup.append(mathInput, mathSymbols, el("div", { className:"rte-popup-actions" }, [
      el("button", { className:"rte-popup-btn secondary", onClick:() => mathPopup.classList.remove("show") }, "Cancel"),
      el("button", { className:"rte-popup-btn primary", onClick:() => { if(mathInput.value){ restoreSelection(savedRange); exec("insertHTML",'<span style="font-family:serif;font-style:italic">'+mathInput.value+'</span>'); mathPopup.classList.remove("show"); mathInput.value=""; } } }, "Insert"),
    ])); allPopups.push(mathPopup);

    // ── Toggle popup helper ──
    function togglePopup(popup) {
      allPopups.forEach(p => { if (p !== popup) p.classList.remove("show"); });
      savedRange = saveSelection(); popup.classList.toggle("show");
      popup.style.top = toolbar.offsetHeight + 4 + "px"; popup.style.left = "8px";
    }
    content.addEventListener("mousedown", () => { allPopups.forEach(p => p.classList.remove("show")); if (event.target.tagName !== "IMG") clearImageResize(); });

    // ── Link popup wiring ──
    linkPopup.querySelector(".rte-link-cancel").addEventListener("click", () => linkPopup.classList.remove("show"));
    linkPopup.querySelector(".rte-link-ok").addEventListener("click", () => { const url = linkPopup.querySelector(".rte-link-url").value; const text = linkPopup.querySelector(".rte-link-text").value.trim(); if (url) { restoreSelection(savedRange); if (text) { exec("insertHTML", '<a href="' + url.replace(/"/g, '&quot;') + '">' + text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</a>'); } else { exec("createLink", url); } linkPopup.classList.remove("show"); linkPopup.querySelector(".rte-link-url").value = ""; linkPopup.querySelector(".rte-link-text").value = ""; } });

    // ── Format buttons ──
    const boldBtn = fmtBtn("B", "Bold (Ctrl+B)", () => exec("bold"), "fmt-bold"); formatButtons.bold = boldBtn;
    const italicBtn = fmtBtn("I", "Italic (Ctrl+I)", () => exec("italic"), "fmt-italic"); formatButtons.italic = italicBtn;
    const underlineBtn = fmtBtn("U", "Underline (Ctrl+U)", () => exec("underline"), "fmt-underline"); formatButtons.underline = underlineBtn;
    const strikeBtn = fmtBtn("S", "Strikethrough", () => exec("strikeThrough"), "fmt-strike"); formatButtons.strike = strikeBtn;
    const supBtn = fmtBtn("X\u00B2", "Superscript", () => exec("superscript"), "fmt-sup"); formatButtons.sup = supBtn;
    const subBtn = fmtBtn("X\u2082", "Subscript", () => exec("subscript"), "fmt-sub"); formatButtons.sub = subBtn;

    // ── Toast ──
    const toast = el("div", { className:"rte-toast" });
    function showToast(msg) { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2000); }

    // ── Watermark ──
    let watermarkEl = null;
    function setWatermark(text) { if (watermarkEl) { watermarkEl.remove(); watermarkEl = null; } if (text) { watermarkEl = el("div", { className:"rte-pro-watermark" }, text); wrap.appendChild(watermarkEl); } }
    if (options.watermark) setWatermark(options.watermark);

    // ── Fullscreen ──
    let isFullscreen = false;
    function toggleFullscreen() { isFullscreen = !isFullscreen; wrap.classList.toggle("rte-pro-fullscreen", isFullscreen); document.body.style.overflow = isFullscreen ? "hidden" : ""; showToast(isFullscreen ? "Fullscreen mode" : "Normal mode"); }

    // ── Focus mode ──
    let isFocusMode = options.focusMode;
    function toggleFocusMode() { isFocusMode = !isFocusMode; wrap.classList.toggle("rte-pro-focus-mode", isFocusMode); showToast(isFocusMode ? "Focus mode on" : "Focus mode off"); }
    if (isFocusMode) wrap.classList.add("rte-pro-focus-mode");
    document.addEventListener("selectionchange", () => {
      if (!isFocusMode) return;
      content.querySelectorAll(".active-block").forEach(b => b.classList.remove("active-block"));
      const sel = window.getSelection();
      if (sel.rangeCount && content.contains(sel.anchorNode)) { const b = getTopLevelBlock(sel.anchorNode, content); if (b && b.nodeType === 1) b.classList.add("active-block"); }
    });

    // ── Gridlines ──
    let isGridlines = false;
    function toggleGridlines() {
      isGridlines = !isGridlines;
      wrap.classList.toggle("rte-pro-gridlines", isGridlines);
      if (isGridlines) applyGridlineTags(); else clearGridlineTags();
      showToast(isGridlines ? "Gridlines on" : "Gridlines off");
    }
    function applyGridlineTags() {
      content.querySelectorAll("p,h1,h2,h3,h4,h5,h6,blockquote,pre,ul,ol,li,table").forEach(el => {
        el.setAttribute("data-rte-tag", el.tagName.toLowerCase());
      });
    }
    function clearGridlineTags() {
      content.querySelectorAll("[data-rte-tag]").forEach(el => el.removeAttribute("data-rte-tag"));
    }

    // ── Source view ──
    let isSourceView = false, sourceArea = null;
    function toggleSourceView() {
      isSourceView = !isSourceView;
      if (isSourceView) { sourceArea = el("textarea", { className:"rte-pro-source" }); sourceArea.value = content.innerHTML; content.style.display = "none"; content.parentNode.insertBefore(sourceArea, content); }
      else { if (sourceArea) { content.innerHTML = sourceArea.value; sourceArea.remove(); sourceArea = null; } content.style.display = ""; updateStatus(); }
      showToast(isSourceView ? "Source view" : "Visual view");
    }

    // ── Find & Replace ──
    let findBarEl = null, findMatches = [], findCurrentIdx = -1;
    function toggleFindBar() {
      if (findBarEl) { closeFindBar(); return; }
      findBarEl = el("div", { className:"rte-pro-findbar" });
      const findInput = el("input", { type:"text", placeholder:"Find...", style:{ width:"140px" } });
      const replaceInput = el("input", { type:"text", placeholder:"Replace...", style:{ width:"140px" } });
      const matchCount = el("span", { className:"rte-pro-match-count" }, "0 matches");
      const regexLabel = el("label", { style:{ fontSize:"12px", display:"flex", alignItems:"center", gap:"3px", cursor:"pointer" } });
      const regexInput = el("input", { type:"checkbox", style:{ margin:"0" } }); regexLabel.append(regexInput, "Regex");
      findBarEl.append(findInput,
        el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px",fontSize:"12px" }, onClick:() => navigateMatch(1) }, "\u25BC"),
        el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px",fontSize:"12px" }, onClick:() => navigateMatch(-1) }, "\u25B2"),
        matchCount, regexLabel, replaceInput,
        el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px",fontSize:"12px" }, onClick:replaceCurrent }, "Replace"),
        el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px",fontSize:"12px" }, onClick:replaceAll }, "All"),
        el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px",fontSize:"12px" }, onClick:closeFindBar }, "\u2715")
      );
      toolbar.parentNode.insertBefore(findBarEl, toolbar.nextSibling);
      findInput.focus();

      function doFind() {
        clearHighlights(); findMatches = []; findCurrentIdx = -1;
        const q = findInput.value; if (!q) { matchCount.textContent = "0 matches"; return; }
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null);
        const textNodes = []; while (walker.nextNode()) textNodes.push(walker.currentNode);
        textNodes.forEach(node => {
          let regex; try { regex = regexInput.checked ? new RegExp(q, "gi") : new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "gi"); } catch(e) { return; }
          let m, matches = []; while ((m = regex.exec(node.textContent)) !== null) matches.push({ index:m.index, length:m[0].length });
          for (let i = matches.length - 1; i >= 0; i--) {
            const mt = matches[i]; const range = document.createRange(); range.setStart(node, mt.index); range.setEnd(node, mt.index + mt.length);
            const mark = document.createElement("mark"); mark.className = "rte-pro-highlight-match"; range.surroundContents(mark); findMatches.unshift(mark);
          }
        });
        matchCount.textContent = findMatches.length + " match" + (findMatches.length !== 1 ? "es" : "");
        if (findMatches.length > 0) navigateMatch(1);
      }
      function navigateMatch(dir) {
        if (!findMatches.length) return;
        if (findCurrentIdx >= 0 && findCurrentIdx < findMatches.length) { findMatches[findCurrentIdx].classList.remove("rte-pro-highlight-current"); findMatches[findCurrentIdx].classList.add("rte-pro-highlight-match"); }
        findCurrentIdx += dir; if (findCurrentIdx >= findMatches.length) findCurrentIdx = 0; if (findCurrentIdx < 0) findCurrentIdx = findMatches.length - 1;
        findMatches[findCurrentIdx].classList.remove("rte-pro-highlight-match"); findMatches[findCurrentIdx].classList.add("rte-pro-highlight-current");
        findMatches[findCurrentIdx].scrollIntoView({ block:"center", behavior:"smooth" }); matchCount.textContent = (findCurrentIdx+1)+"/"+findMatches.length;
      }
      function replaceCurrent() { if (findCurrentIdx < 0 || findCurrentIdx >= findMatches.length) return; findMatches[findCurrentIdx].replaceWith(document.createTextNode(replaceInput.value)); findMatches.splice(findCurrentIdx,1); if (!findMatches.length) { matchCount.textContent="0 matches"; findCurrentIdx=-1; return; } if (findCurrentIdx>=findMatches.length) findCurrentIdx=0; navigateMatch(0); updateStatus(); }
      function replaceAll() { const n = findMatches.length; findMatches.forEach(m => m.replaceWith(document.createTextNode(replaceInput.value))); showToast("Replaced "+n+" matches"); findMatches=[]; findCurrentIdx=-1; matchCount.textContent="0 matches"; updateStatus(); }
      findInput.addEventListener("input", debounce(doFind, 200)); regexInput.addEventListener("change", doFind);
    }
    function clearHighlights() { content.querySelectorAll("mark.rte-pro-highlight-match, mark.rte-pro-highlight-current").forEach(m => m.replaceWith(document.createTextNode(m.textContent))); }
    function closeFindBar() { clearHighlights(); if (findBarEl) { findBarEl.remove(); findBarEl = null; } findMatches = []; findCurrentIdx = -1; }

    // ── Markdown toggle ──
    let isMarkdown = false;
    function toggleMarkdown() {
      isMarkdown = !isMarkdown;
      if (isMarkdown) { content.innerText = htmlToMarkdown(content.innerHTML); content.setAttribute("data-md-mode","true"); }
      else { content.innerHTML = markdownToHtml(content.innerText); content.removeAttribute("data-md-mode"); }
      showToast(isMarkdown ? "Markdown mode" : "Visual mode");
    }
    function htmlToMarkdown(html) {
      let md = html;
      md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n"); md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n");
      md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n"); md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n");
      md = md.replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**"); md = md.replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**");
      md = md.replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*"); md = md.replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*");
      md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
      md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
      md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");
      md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n"); md = md.replace(/<\/?[ou]l[^>]*>/gi, "\n");
      md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n");
      md = md.replace(/<pre[^>]*><code[^>]*>(.*?)<\/code><\/pre>/gi, "```\n$1\n```\n");
      md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, "```\n$1\n```\n");
      md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, "`$1`"); md = md.replace(/<hr[^>]*\/?>/gi, "\n---\n");
      md = md.replace(/<br[^>]*\/?>/gi, "\n"); md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
      md = md.replace(/<[^>]+>/g, ""); md = md.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&nbsp;/g," ");
      return md.replace(/\n{3,}/g, "\n\n").trim();
    }
    function markdownToHtml(md) {
      let html = md;
      html = html.replace(/```([^`]*?)```/gs, "<pre>$1</pre>");
      html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>"); html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
      html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>"); html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
      html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      html = html.replace(/^---$/gm, "<hr>"); html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
      html = html.replace(/^- (.+)$/gm, "<li>$1</li>"); html = html.replace(/(<li>.*<\/li>\n?)+/g, m => "<ul>"+m+"</ul>");
      html = html.replace(/^(?!<[a-z]).+$/gm, m => m.trim() ? "<p>"+m+"</p>" : "");
      return html.replace(/<p>\s*<\/p>/g, "");
    }

    // ── Context menu ──
    content.addEventListener("contextmenu", e => {
      const items = [];
      const td = e.target.closest("td, th");
      if (td) {
        const table = td.closest("table"), tr = td.parentElement, ci = Array.from(tr.children).indexOf(td);
        items.push(["Add Row Above", () => { const nr = tr.cloneNode(true); Array.from(nr.cells).forEach(c => c.innerHTML = "&nbsp;"); tr.parentNode.insertBefore(nr, tr); }],
          ["Add Row Below", () => { const nr = tr.cloneNode(true); Array.from(nr.cells).forEach(c => c.innerHTML = "&nbsp;"); tr.parentNode.insertBefore(nr, tr.nextSibling); }],
          ["Delete Row", () => { if (table.querySelectorAll("tr").length > 1) tr.remove(); else table.remove(); }],
          null,
          ["Add Column Left", () => { table.querySelectorAll("tr").forEach(r => { const c = document.createElement(r.rowIndex === 0 ? "th" : "td"); c.innerHTML = "&nbsp;"; r.insertBefore(c, r.children[ci]); }); }],
          ["Add Column Right", () => { table.querySelectorAll("tr").forEach(r => { const c = document.createElement(r.rowIndex === 0 ? "th" : "td"); c.innerHTML = "&nbsp;"; r.insertBefore(c, r.children[ci + 1] || null); }); }],
          ["Delete Column", () => { table.querySelectorAll("tr").forEach(r => { if (r.children[ci]) r.children[ci].remove(); }); if (!table.querySelector("td,th")) table.remove(); }],
          null, ["Delete Table", () => table.remove()]);
      }
      const img = e.target.closest("img");
      if (img) { items.push(["Resize 25%", () => { img.style.width = "25%"; }], ["Resize 50%", () => { img.style.width = "50%"; }], ["Resize 75%", () => { img.style.width = "75%"; }], ["Resize 100%", () => { img.style.width = "100%"; }], null, ["Remove Image", () => img.remove()]); }
      const link = e.target.closest("a");
      if (link) { items.push(["Edit Link URL", () => { const u = prompt("Edit URL:", link.href); if (u) link.href = u; }], ["Open Link", () => window.open(link.href, "_blank")], ["Unlink", () => { link.replaceWith(document.createTextNode(link.textContent)); }]); }
      if (e.target.closest("video")) items.push(["Remove Video", () => e.target.closest("video").remove()]);
      if (e.target.closest("audio")) items.push(["Remove Audio", () => e.target.closest("audio").remove()]);
      if (e.target.tagName === "HR" || e.target.closest("hr")) items.push(["Remove Horizontal Rule", () => (e.target.tagName === "HR" ? e.target : e.target.closest("hr")).remove()]);
      const bq = e.target.closest("blockquote");
      if (bq) items.push(["Remove Blockquote", () => { const p = document.createElement("p"); p.innerHTML = bq.innerHTML; bq.parentNode.replaceChild(p, bq); }]);
      const pre = e.target.closest("pre");
      if (pre) items.push(["Remove Code Block", () => { const p = document.createElement("p"); p.textContent = pre.textContent; pre.parentNode.replaceChild(p, pre); }]);
      const li = e.target.closest("li");
      if (li) { const list = li.closest("ul, ol"); if (list) items.push(["Remove List", () => { const f = document.createDocumentFragment(); Array.from(list.children).forEach(i => { const p = document.createElement("p"); p.innerHTML = i.innerHTML; f.appendChild(p); }); list.parentNode.replaceChild(f, list); }]); }
      const cols = e.target.closest(".rte-pro-cols");
      if (cols) items.push(["Remove Columns", () => { const f = document.createDocumentFragment(); cols.querySelectorAll(".rte-pro-col").forEach(col => { while (col.firstChild) f.appendChild(col.firstChild); }); cols.replaceWith(f); }]);
      if (items.length) items.push(null);
      items.push(["Select All", () => { const r = document.createRange(); r.selectNodeContents(content); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); }],
        ["Clear Formatting", () => exec("removeFormat")]);
      e.preventDefault();
      document.querySelectorAll(".rte-ctx-menu").forEach(m => m.remove());
      const menu = el("div", { className: "rte-popup rte-ctx-menu show", style: { position: "fixed", left: e.clientX + "px", top: e.clientY + "px" } });
      items.forEach(item => { if (!item) { menu.appendChild(el("div", { className: "rte-ctx-sep" })); return; } menu.appendChild(el("div", { className: "rte-ctx-item", onClick: () => { item[1](); menu.remove(); updateStatus(); } }, item[0])); });
      document.body.appendChild(menu);
      setTimeout(() => { const close = ev => { if (!menu.contains(ev.target)) { menu.remove(); document.removeEventListener("click", close); } }; document.addEventListener("click", close); }, 0);
    });

    // ── Drag & drop ──
    const _dragWrap = el("div", { style: { position: "relative" } });
    let _dragEl = null, _dragTarget = null;
    const _dragHandle = document.createElement("div");
    _dragHandle.className = "rte-drag-handle"; _dragHandle.draggable = true; _dragHandle.contentEditable = "false"; _dragHandle.innerHTML = "⋮⋮";
    const _dropLine = document.createElement("div"); _dropLine.className = "rte-drop-line"; _dropLine.contentEditable = "false";

    // Show handle on hover over any direct child block
    content.addEventListener("mousemove", e => {
      if (_dragEl) return;
      let node = e.target;
      while (node && node !== content && node.parentNode !== content) node = node.parentNode;
      if (!node || node === content || node === _dragHandle || node === _dropLine) return;
      if (node === _dragTarget) return; _dragTarget = node;
      const r = node.getBoundingClientRect(), cr = _dragWrap.getBoundingClientRect();
      _dragHandle.style.top = (r.top - cr.top + _dragWrap.scrollTop) + "px";
      _dragHandle.style.opacity = "0.4";
      if (!_dragHandle.parentNode) _dragWrap.appendChild(_dragHandle);
    });
    content.addEventListener("mouseleave", () => { if (!_dragEl) { _dragHandle.remove(); _dragTarget = null; } });

    // Drag start from handle
    _dragHandle.addEventListener("dragstart", e => {
      if (!_dragTarget) return; _dragEl = _dragTarget;
      _dragEl.classList.add("rte-dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "");
    });

    // Show drop indicator on dragover
    _dragWrap.addEventListener("dragover", e => {
      if (!_dragEl) return; e.preventDefault(); e.dataTransfer.dropEffect = "move";
      const kids = Array.from(content.children).filter(c => c !== _dropLine && c !== _dragHandle);
      let best = null, before = true, bestD = Infinity;
      kids.forEach(k => { const r = k.getBoundingClientRect(), mid = r.top + r.height/2, d = Math.abs(e.clientY - mid);
        if (d < bestD) { bestD = d; best = k; before = e.clientY < mid; } });
      if (best) { if (before) content.insertBefore(_dropLine, best); else content.insertBefore(_dropLine, best.nextSibling); }
    });

    // Drop: move element to indicator position
    _dragWrap.addEventListener("drop", e => {
      if (!_dragEl) return; e.preventDefault(); e.stopPropagation();
      if (_dropLine.parentNode) content.insertBefore(_dragEl, _dropLine);
      _dragDone();
    });
    _dragWrap.addEventListener("dragend", _dragDone);
    function _dragDone() {
      if (_dragEl) _dragEl.classList.remove("rte-dragging");
      _dragEl = null; _dragTarget = null;
      _dropLine.remove(); _dragHandle.remove(); updateStatus();
    }

    // ── Footnotes ──
    let footnoteCounter = 0;
    function insertChecklist() {
      exec("insertHTML", '<ul class="rte-checklist"><li>Item 1</li></ul><p><br></p>');
    }

    function insertFootnote() {
      footnoteCounter++; const id = "fn-" + footnoteCounter;
      exec("insertHTML", '<sup class="rte-pro-footnote-ref" data-fn="'+id+'">['+footnoteCounter+']</sup>');
      let fnC = content.querySelector(".rte-pro-footnotes");
      if (!fnC) { fnC = el("div", { className:"rte-pro-footnotes" }); fnC.innerHTML = "<strong>Footnotes</strong>"; content.appendChild(fnC); }
      const item = el("div", { id:id, style:{ marginTop:"4px" } }); item.innerHTML = '<sup>'+footnoteCounter+'</sup> <span contenteditable="true" style="outline:none">Enter footnote text...</span>';
      fnC.appendChild(item);
    }

    // ── Table of Contents ──
    function insertTOC() {
      const headings = content.querySelectorAll("h1, h2, h3, h4");
      if (!headings.length) { showToast("No headings found"); return; }
      let tocHTML = '<div class="rte-pro-toc"><strong>Table of Contents</strong>';
      headings.forEach((h, i) => { const id = "toc-heading-"+i; h.id = id; tocHTML += '<a href="#'+id+'" class="toc-'+h.tagName.toLowerCase()+'">'+h.textContent+'</a>'; });
      tocHTML += '</div><p><br></p>';
      const sel = window.getSelection();
      if (sel.rangeCount && content.contains(sel.anchorNode)) exec("insertHTML", tocHTML);
      else content.insertAdjacentHTML("afterbegin", tocHTML);
      showToast("Table of Contents inserted");
    }

    // ── Code syntax highlighting ──
    function highlightCode() {
      content.querySelectorAll("pre").forEach(pre => {
        if (pre.dataset.highlighted) return; let code = pre.textContent;
        code = code.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
        code = code.replace(/(\/\/.*$)/gm, '<span class="rte-pro-cmt">$1</span>');
        code = code.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="rte-pro-cmt">$1</span>');
        code = code.replace(/(#.*$)/gm, '<span class="rte-pro-cmt">$1</span>');
        code = code.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="rte-pro-str">$1</span>');
        code = code.replace(/('(?:[^'\\]|\\.)*')/g, '<span class="rte-pro-str">$1</span>');
        code = code.replace(/\b(\d+\.?\d*)\b/g, '<span class="rte-pro-num">$1</span>');
        code = code.replace(/\b(function|const|let|var|if|else|for|while|return|class|import|export|from|default|new|this|try|catch|throw|async|await|yield|switch|case|break|continue|do|in|of|typeof|instanceof|void|delete)\b/g, '<span class="rte-pro-kw">$1</span>');
        pre.innerHTML = code; pre.dataset.highlighted = "true";
      });
    }
    const debouncedHighlight = debounce(highlightCode, 500);

    // ── Panel system ──
    let activePanel = null;
    const panelContainer = el("div", { className:"rte-pro-panel" });
    const panelHeader = el("div", { className:"rte-pro-panel-header" });
    const panelTitle = el("span", {}, "Panel");
    const panelCloseBtn = el("button", { className:"rte-popup-btn secondary", style:{ padding:"4px 8px" }, onClick:() => closePanel() }, "\u2715");
    panelHeader.append(panelTitle, panelCloseBtn);
    const panelBody = el("div", { className:"rte-pro-panel-body" });
    panelContainer.append(panelHeader, panelBody);
    function openPanel(name, title, contentFn) { activePanel = name; panelTitle.textContent = title; panelBody.innerHTML = ""; contentFn(panelBody); panelContainer.classList.add("open"); }
    function closePanel() { activePanel = null; panelContainer.classList.remove("open"); }
    function togglePanel(name) {
      if (activePanel === name) { closePanel(); return; }
      switch(name) {
        case "ai": openAIPanel(); break; case "readability": openReadabilityPanel(); break;
        case "seo": openSEOPanel(); break; case "accessibility": openAccessibilityPanel(); break;
        case "versionHistory": openVersionHistoryPanel(); break; case "undoHistory": openUndoHistoryPanel(); break;
      }
    }

    // ── Readability panel ──
    function openReadabilityPanel() {
      openPanel("readability", "\u{1F4CA} Readability Analysis", body => {
        const text = content.innerText || ""; const words = text.trim() ? text.trim().split(/\s+/) : [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const totalSyl = words.reduce((s,w) => s + countSyllables(w), 0);
        const wc = words.length, sc = Math.max(sentences.length, 1);
        const flesch = (206.835 - 1.015*(wc/sc) - 84.6*(totalSyl/Math.max(wc,1))).toFixed(1);
        const grade = (0.39*(wc/sc) + 11.8*(totalSyl/Math.max(wc,1)) - 15.59).toFixed(1);
        let level = "Very Difficult", color = "#ef4444";
        if (flesch >= 90) { level="Very Easy"; color="#22c55e"; } else if (flesch >= 80) { level="Easy"; color="#22c55e"; }
        else if (flesch >= 70) { level="Fairly Easy"; color="#84cc16"; } else if (flesch >= 60) { level="Standard"; color="#eab308"; }
        else if (flesch >= 50) { level="Fairly Difficult"; color="#f97316"; } else if (flesch >= 30) { level="Difficult"; color="#ef4444"; }
        body.innerHTML = '<div style="text-align:center;margin-bottom:16px"><div style="font-size:48px;font-weight:700;color:'+color+'">'+flesch+'</div><div style="font-size:14px;color:#64748b">Flesch Reading Ease</div><div style="font-size:16px;font-weight:600;color:'+color+'">'+level+'</div></div>'+
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">'+
          '<div style="background:#f8f9fb;padding:10px;border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:600">'+grade+'</div><div style="font-size:11px;color:#64748b">Grade Level</div></div>'+
          '<div style="background:#f8f9fb;padding:10px;border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:600">'+(wc/sc).toFixed(1)+'</div><div style="font-size:11px;color:#64748b">Avg Words/Sentence</div></div>'+
          '<div style="background:#f8f9fb;padding:10px;border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:600">'+(wc>0?(totalSyl/wc).toFixed(2):0)+'</div><div style="font-size:11px;color:#64748b">Avg Syllables/Word</div></div>'+
          '<div style="background:#f8f9fb;padding:10px;border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:600">'+sc+'</div><div style="font-size:11px;color:#64748b">Sentences</div></div></div>';
      });
    }

    // ── SEO panel ──
    function openSEOPanel() {
      openPanel("seo", "\u{1F50E} SEO Check", body => {
        const issues = [], good = [];
        const h1s = content.querySelectorAll("h1");
        if (!h1s.length) issues.push("No H1 heading found"); else if (h1s.length > 1) issues.push("Multiple H1 headings ("+h1s.length+")"); else good.push("Single H1 heading present");
        const headings = content.querySelectorAll("h1,h2,h3,h4,h5,h6"); let prev = 0, ok = true;
        headings.forEach(h => { const l = parseInt(h.tagName[1]); if (l > prev + 1 && prev > 0) ok = false; prev = l; });
        if (ok && headings.length > 0) good.push("Heading hierarchy is correct"); else if (!ok) issues.push("Heading levels are skipped");
        const imgs = content.querySelectorAll("img"), noAlt = Array.from(imgs).filter(i => !i.alt || i.alt === "image");
        if (imgs.length > 0 && !noAlt.length) good.push("All images have alt text"); else if (noAlt.length) issues.push(noAlt.length+" image(s) missing descriptive alt text");
        const wc = (content.innerText.trim() ? content.innerText.trim().split(/\s+/).length : 0);
        if (wc < 300) issues.push("Content is short ("+wc+" words) \u2014 aim for 300+"); else good.push("Content length is adequate ("+wc+" words)");
        const links = content.querySelectorAll("a[href]");
        if (!links.length && wc > 100) issues.push("No links found"); else if (links.length) good.push(links.length+" link(s) present");
        let html = "";
        if (issues.length) { html += '<div style="margin-bottom:12px"><strong style="color:#ef4444">Issues ('+issues.length+')</strong>'; issues.forEach(i => html += '<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px">\u26A0\uFE0F '+i+'</div>'); html += '</div>'; }
        if (good.length) { html += '<div><strong style="color:#22c55e">Passed ('+good.length+')</strong>'; good.forEach(g => html += '<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px">\u2705 '+g+'</div>'); html += '</div>'; }
        body.innerHTML = html;
      });
    }

    // ── Accessibility panel ──
    function openAccessibilityPanel() {
      openPanel("accessibility", "\u267F Accessibility Check", body => {
        const issues = [], good = [];
        const imgs = content.querySelectorAll("img"), noAlt = Array.from(imgs).filter(i => !i.alt || !i.alt.trim() || i.alt === "image");
        if (noAlt.length) issues.push(noAlt.length+" image(s) missing descriptive alt text"); else if (imgs.length) good.push("All images have alt text");
        const links = content.querySelectorAll("a"), badLinks = Array.from(links).filter(a => { const t = a.textContent.trim().toLowerCase(); return ["click here","here","link","read more"].includes(t) || t.length < 2; });
        if (badLinks.length) issues.push(badLinks.length+" link(s) have non-descriptive text"); else if (links.length) good.push("All links have descriptive text");
        const headings = content.querySelectorAll("h1,h2,h3,h4,h5,h6"); let prev = 0, ok = true;
        headings.forEach(h => { const l = parseInt(h.tagName[1]); if (l > prev+1 && prev > 0) ok = false; prev = l; });
        if (ok && headings.length) good.push("Heading order is sequential"); else if (!ok) issues.push("Heading levels are skipped");
        const tables = content.querySelectorAll("table"), noH = Array.from(tables).filter(t => !t.querySelector("th"));
        if (noH.length) issues.push(noH.length+" table(s) missing header cells"); else if (tables.length) good.push("All tables have header cells");
        let html = "";
        if (issues.length) { html += '<div style="margin-bottom:12px"><strong style="color:#ef4444">Issues ('+issues.length+')</strong>'; issues.forEach(i => html += '<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px">\u26A0\uFE0F '+i+'</div>'); html += '</div>'; }
        if (good.length) { html += '<div><strong style="color:#22c55e">Passed ('+good.length+')</strong>'; good.forEach(g => html += '<div style="padding:6px 0;border-bottom:1px solid #f1f5f9;font-size:13px">\u2705 '+g+'</div>'); html += '</div>'; }
        if (!issues.length && !good.length) html = '<p style="color:#64748b">No content to analyze.</p>';
        body.innerHTML = html;
      });
    }

    // ── Slash commands ──
    let slashMenu = null, slashSelectedIdx = 0;
    function handleSlashInput() {
      const sel = window.getSelection(); if (!sel.rangeCount) return;
      const node = sel.anchorNode; if (!node || node.nodeType !== 3) { closeSlashMenu(); return; }
      const text = node.textContent, offset = sel.anchorOffset, before = text.substring(0, offset);
      const slashIdx = before.lastIndexOf("/");
      if (slashIdx === -1 || (slashIdx > 0 && before[slashIdx-1] !== " " && before[slashIdx-1] !== "\n")) { closeSlashMenu(); return; }
      const filter = before.substring(slashIdx + 1).toLowerCase();
      const filtered = SLASH_COMMANDS.filter(c => c.label.toLowerCase().includes(filter) || c.cmd.includes(filter));
      if (!filtered.length) { closeSlashMenu(); return; }
      showSlashMenu(filtered, node, slashIdx, offset);
    }
    function showSlashMenu(items, textNode, slashIdx, cursorOffset) {
      closeSlashMenu(); slashSelectedIdx = 0;
      slashMenu = el("div", { className:"rte-pro-slash-menu" });
      items.forEach((item, idx) => {
        const row = el("div", { className:"rte-pro-slash-item"+(idx===0?" selected":""), onMouseenter:() => { slashMenu.querySelectorAll(".rte-pro-slash-item").forEach(r=>r.classList.remove("selected")); row.classList.add("selected"); slashSelectedIdx=idx; },
          onClick:() => executeSlashCommand(item, textNode, slashIdx, cursorOffset) });
        row.innerHTML = '<span class="rte-pro-slash-icon">'+item.icon+'</span><div><div style="font-weight:500">'+item.label+'</div><div style="font-size:11px;color:#64748b">'+item.description+'</div></div>';
        slashMenu.appendChild(row);
      });
      const range = window.getSelection().getRangeAt(0), rect = range.getBoundingClientRect(), wrapRect = wrap.getBoundingClientRect();
      slashMenu.style.left = (rect.left - wrapRect.left) + "px"; slashMenu.style.top = (rect.bottom - wrapRect.top + 4) + "px";
      wrap.appendChild(slashMenu);
    }
    function closeSlashMenu() { if (slashMenu) { slashMenu.remove(); slashMenu = null; } }
    function editorCut() {
      if (resizeImg) {
        const html = resizeImg.outerHTML;
        navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([html], {type:"text/html"}),
          "text/plain": new Blob([resizeImg.alt||""], {type:"text/plain"})
        })]);
        resizeImg.remove(); clearImageResize(); updateStatus();
      } else {
        document.execCommand("cut");
      }
    }
    function editorCopy() {
      if (resizeImg) {
        const html = resizeImg.outerHTML;
        navigator.clipboard.write([new ClipboardItem({
          "text/html": new Blob([html], {type:"text/html"}),
          "text/plain": new Blob([resizeImg.alt||""], {type:"text/plain"})
        })]);
      } else {
        document.execCommand("copy");
      }
    }
    function editorPaste() {
      navigator.clipboard.read().then(items => {
        for (const item of items) {
          if (item.types.includes("text/html")) {
            item.getType("text/html").then(blob => blob.text()).then(html => exec("insertHTML", html));
            return;
          }
          if (item.types.includes("text/plain")) {
            item.getType("text/plain").then(blob => blob.text()).then(text => exec("insertText", text));
            return;
          }
        }
      });
    }
    function insertColumns(n) {
      const sel = window.getSelection();
      const anchor = sel.anchorNode;
      const existing = anchor?.closest?.(".rte-pro-cols") || anchor?.parentElement?.closest?.(".rte-pro-cols");
      if (existing) {
        const frag = document.createDocumentFragment();
        existing.querySelectorAll(".rte-pro-col").forEach(col => { while (col.firstChild) frag.appendChild(col.firstChild); });
        existing.replaceWith(frag);
        updateStatus(); return;
      }
      const grid = document.createElement("div");
      grid.className = "rte-pro-cols rte-pro-cols-" + n;
      grid.contentEditable = "false";
      for (let i = 0; i < n; i++) {
        if (i > 0) { const handle = document.createElement("div"); handle.className = "rte-pro-col-handle"; handle.contentEditable = "false"; grid.appendChild(handle); }
        const col = document.createElement("div"); col.className = "rte-pro-col"; col.contentEditable = "true"; col.innerHTML = "<p><br></p>"; grid.appendChild(col);
      }
      exec("insertHTML", grid.outerHTML + "<p><br></p>");
    }
    function executeSlashCommand(item, textNode, slashIdx, cursorOffset) {
      textNode.textContent = textNode.textContent.substring(0, slashIdx) + textNode.textContent.substring(cursorOffset);
      const sel = window.getSelection(), range = document.createRange(); range.setStart(textNode, slashIdx); range.collapse(true); sel.removeAllRanges(); sel.addRange(range);
      closeSlashMenu();
      switch(item.cmd) {
        case "heading1": exec("formatBlock","<h1>"); break; case "heading2": exec("formatBlock","<h2>"); break; case "heading3": exec("formatBlock","<h3>"); break;
        case "paragraph": exec("formatBlock","<p>"); break; case "bulletList": exec("insertUnorderedList"); break; case "numberedList": exec("insertOrderedList"); break;
        case "blockquote": exec("formatBlock","<blockquote>"); break; case "codeBlock": exec("formatBlock","<pre>"); break; case "horizontalRule": exec("insertHorizontalRule"); break;
        case "table": exec("insertHTML","<table><tbody><tr><th>&nbsp;</th><th>&nbsp;</th></tr><tr><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p><br></p>"); break;
        case "image": togglePopup(imagePopup); break; case "pageBreak": exec("insertHTML",'<div class="rte-pro-page-break"></div><p><br></p>'); break;
        case "toc": insertTOC(); break; case "footnote": insertFootnote(); break;
        case "columns2": insertColumns(2); break;
        case "columns3": insertColumns(3); break;
        case "checklist": insertChecklist(); break;
      }
    }

    // ── @ Mentions ──
    let mentionMenu = null, mentionSelectedIdx = 0;
    function handleMentions() {
      if (!options.mentions || !options.mentions.length) { closeMentionMenu(); return; }
      const sel = window.getSelection(); if (!sel.rangeCount) return;
      const node = sel.anchorNode; if (!node || node.nodeType !== 3) { closeMentionMenu(); return; }
      const text = node.textContent, offset = sel.anchorOffset, before = text.substring(0, offset);
      const atIdx = before.lastIndexOf("@");
      if (atIdx === -1 || (atIdx > 0 && before[atIdx-1] !== " " && before[atIdx-1] !== "\n")) { closeMentionMenu(); return; }
      const filter = before.substring(atIdx + 1).toLowerCase();
      const filtered = options.mentions.filter(m => m.name.toLowerCase().includes(filter));
      if (!filtered.length) { closeMentionMenu(); return; }
      closeMentionMenu(); mentionSelectedIdx = 0;
      mentionMenu = el("div", { className:"rte-pro-slash-menu" });
      filtered.forEach((m, idx) => {
        const row = el("div", { className:"rte-pro-slash-item"+(idx===0?" selected":""), onMouseenter:() => { mentionMenu.querySelectorAll(".rte-pro-slash-item").forEach(r=>r.classList.remove("selected")); row.classList.add("selected"); mentionSelectedIdx=idx; },
          onClick:() => { node.textContent = text.substring(0, atIdx) + text.substring(offset); const r = document.createRange(); r.setStart(node, atIdx); r.collapse(true); sel.removeAllRanges(); sel.addRange(r); exec("insertHTML",'<span class="rte-pro-mention" contenteditable="false" data-mention-id="'+(m.id||"")+'">@'+m.name+'</span>&nbsp;'); closeMentionMenu(); } });
        row.innerHTML = '<span class="rte-pro-slash-icon">'+(m.avatar||"\u{1F464}")+'</span><div style="font-weight:500">'+m.name+'</div>';
        mentionMenu.appendChild(row);
      });
      const range = sel.getRangeAt(0), rect = range.getBoundingClientRect(), wrapRect = wrap.getBoundingClientRect();
      mentionMenu.style.left = (rect.left - wrapRect.left) + "px"; mentionMenu.style.top = (rect.bottom - wrapRect.top + 4) + "px";
      wrap.appendChild(mentionMenu);
    }
    function closeMentionMenu() { if (mentionMenu) { mentionMenu.remove(); mentionMenu = null; } }

    // ── Hashtag auto-linking ──
    function handleHashtags() {
      if (!options.hashtagUrl) return;
      const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null); const nodes = [];
      while (walker.nextNode()) { if (!walker.currentNode.parentElement.closest(".rte-pro-hashtag, a")) nodes.push(walker.currentNode); }
      nodes.forEach(node => {
        const match = node.textContent.match(/(^|\s)(#[a-zA-Z][\w]{1,30})(\s|$)/);
        if (!match) return; const tag = match[2], idx = match.index + match[1].length;
        const range = document.createRange(); range.setStart(node, idx); range.setEnd(node, idx + tag.length);
        const link = document.createElement("a"); link.className = "rte-pro-hashtag"; link.href = options.hashtagUrl.replace("{{tag}}", tag.substring(1)); link.contentEditable = "false";
        range.surroundContents(link);
      });
    }

    // ── Block drag reordering ──
    let dragBlock = null;
    content.addEventListener("mouseover", e => {
      const block = getTopLevelBlock(e.target, content);
      if (!block || block.nodeType !== 1 || block.querySelector(".rte-pro-drag-handle")) return;
      block.style.position = "relative";
      const handle = el("div", { className:"rte-pro-drag-handle", draggable:"true" }, "\u2807");
      handle.addEventListener("dragstart", ev => { dragBlock = block; block.classList.add("rte-pro-dragging"); ev.dataTransfer.effectAllowed = "move"; });
      handle.addEventListener("dragend", () => { if (dragBlock) dragBlock.classList.remove("rte-pro-dragging"); dragBlock = null; });
      block.appendChild(handle);
    });
    content.addEventListener("dragover", e => { if (dragBlock) { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } });
    content.addEventListener("drop", e => {
      if (!dragBlock) return; e.preventDefault();
      const target = getTopLevelBlock(e.target, content);
      if (target && target !== dragBlock) { const rect = target.getBoundingClientRect(); if (e.clientY < rect.top + rect.height/2) content.insertBefore(dragBlock, target); else content.insertBefore(dragBlock, target.nextSibling); }
      dragBlock.classList.remove("rte-pro-dragging"); dragBlock = null; updateStatus();
    });

    // Slash/mention keyboard nav
    content.addEventListener("keydown", e => {
      const menu = slashMenu || mentionMenu; if (!menu) return;
      const items = menu.querySelectorAll(".rte-pro-slash-item"); let idx = slashMenu ? slashSelectedIdx : mentionSelectedIdx;
      if (e.key === "ArrowDown") { e.preventDefault(); items[idx]?.classList.remove("selected"); idx = (idx+1)%items.length; items[idx]?.classList.add("selected"); items[idx]?.scrollIntoView({ block:"nearest" }); }
      else if (e.key === "ArrowUp") { e.preventDefault(); items[idx]?.classList.remove("selected"); idx = (idx-1+items.length)%items.length; items[idx]?.classList.add("selected"); items[idx]?.scrollIntoView({ block:"nearest" }); }
      else if (e.key === "Enter") { e.preventDefault(); items[idx]?.click(); }
      else if (e.key === "Escape") { e.preventDefault(); closeSlashMenu(); closeMentionMenu(); }
      if (slashMenu) slashSelectedIdx = idx; else mentionSelectedIdx = idx;
    });

    content.addEventListener("input", () => { handleSlashInput(); handleMentions(); handleHashtags(); debouncedHighlight(); if (isGridlines) applyGridlineTags(); });

    // ── Version History ──
    let versions = [];
    function saveVersion(label) {
      versions.push({ html:content.innerHTML, label:label||"Version "+(versions.length+1), timestamp:new Date().toISOString(), wordCount:(content.innerText.trim()?content.innerText.trim().split(/\s+/).length:0) });
      if (versions.length > options.maxVersions) versions.shift();
      showToast("Version saved: " + versions[versions.length-1].label);
    }
    function openVersionHistoryPanel() {
      openPanel("versionHistory", "\u{1F553} Version History", body => {
        if (!versions.length) { body.innerHTML = '<p style="color:#64748b;font-size:13px">No versions saved yet.</p>'; body.appendChild(el("button", { className:"rte-popup-btn primary", style:{ marginTop:"8px" }, onClick:() => { saveVersion(); openVersionHistoryPanel(); } }, "Save Current Version")); return; }
        body.appendChild(el("button", { className:"rte-popup-btn primary", style:{ marginBottom:"12px", width:"100%" }, onClick:() => { saveVersion(); openVersionHistoryPanel(); } }, "\u{1F4BE} Save Current Version"));
        versions.slice().reverse().forEach((v, idx) => {
          const item = el("div", { className:"rte-pro-version-item", onClick:() => { if (confirm("Restore this version?")) { content.innerHTML = v.html; updateStatus(); showToast("Restored: "+v.label); closePanel(); } } });
          item.innerHTML = '<div style="font-weight:500">'+v.label+'</div><div class="rte-pro-version-date">'+new Date(v.timestamp).toLocaleString()+' \u00B7 '+v.wordCount+' words</div>';
          body.appendChild(item);
        });
      });
    }

    // ── Undo History ──
    let undoSnapshots = [], undoIdx = -1, undoLock = false;
    function takeSnapshot() { if (undoLock) return; const html = content.innerHTML; if (undoSnapshots.length && undoSnapshots[undoIdx] === html) return; undoSnapshots = undoSnapshots.slice(0, undoIdx+1); undoSnapshots.push(html); if (undoSnapshots.length > 50) undoSnapshots.shift(); undoIdx = undoSnapshots.length - 1; }
    function customUndo() { takeSnapshot(); if (undoIdx > 0) { undoIdx--; undoLock = true; content.innerHTML = undoSnapshots[undoIdx]; undoLock = false; updateStatus(); } }
    function customRedo() { if (undoIdx < undoSnapshots.length - 1) { undoIdx++; undoLock = true; content.innerHTML = undoSnapshots[undoIdx]; undoLock = false; updateStatus(); } }
    const debouncedSnapshot = debounce(takeSnapshot, 500);
    content.addEventListener("input", debouncedSnapshot);
    takeSnapshot();
    function openUndoHistoryPanel() {
      openPanel("undoHistory", "\u{1F4CB} Undo History", body => {
        if (!undoSnapshots.length) { body.innerHTML = '<p style="color:#64748b;font-size:13px">No history yet.</p>'; return; }
        undoSnapshots.slice().reverse().forEach((snap, idx) => {
          const realIdx = undoSnapshots.length - 1 - idx; const preview = snap.replace(/<[^>]+>/g, "").substring(0, 80);
          const item = el("div", { className:"rte-pro-version-item", style: realIdx === undoIdx ? { background:"#e0e7ff", borderLeft:"3px solid #6366f1" } : {},
            onClick:() => { undoIdx = realIdx; content.innerHTML = undoSnapshots[realIdx]; updateStatus(); showToast("Restored snapshot "+(realIdx+1)); closePanel(); } });
          item.innerHTML = '<div style="font-weight:500;font-size:12px">Snapshot '+(realIdx+1)+(realIdx===undoIdx?' (current)':'')+'</div><div style="font-size:11px;color:#64748b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+(preview||'(empty)')+'</div>';
          body.appendChild(item);
        });
      });
    }

    // ── Autosave ──
    let autosaveTimer = null;
    if (options.autosave) {
      try { const saved = localStorage.getItem(options.autosaveKey); if (saved) { const data = JSON.parse(saved); if (data.html && confirm("Restore autosaved content from "+new Date(data.timestamp).toLocaleString()+"?")) content.innerHTML = data.html; } } catch(e) {}
      const interval = typeof options.autosave === "number" ? options.autosave : 30000;
      autosaveTimer = setInterval(() => { try { localStorage.setItem(options.autosaveKey, JSON.stringify({ html:content.innerHTML, timestamp:new Date().toISOString() })); } catch(e) {} }, interval);
    }

    // ── AI Integration ──
    let aiAbortController = null;
    function openAIPanel() {
      openPanel("ai", "\u{1F916} AI Assistant", body => {
        if (!options.apiKey && !options.aiProxy) { body.innerHTML = '<p style="color:#64748b;font-size:13px">No API key configured. Pass <code>apiKey</code> or <code>aiProxy</code> in options to enable AI features.</p>'; return; }
        const commands = el("div", { style:{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"12px" } });
        [["\u270D\uFE0F Rewrite","Rewrite the following text, improving clarity and flow while preserving meaning:"],
         ["\u{1F4DD} Summarize","Summarize the following text concisely:"],
         ["\u{1F4D6} Expand","Expand on the following text, adding more detail and depth:"],
         ["\u{1F527} Fix Grammar","Fix any grammar, spelling, and punctuation errors in the following text. Return only the corrected text:"],
         ["\u270F\uFE0F Continue","Continue writing from where the following text left off, matching the style and tone:"]
        ].forEach(([label, prompt]) => commands.appendChild(el("button", { className:"rte-popup-btn secondary", style:{ fontSize:"12px", padding:"4px 8px" }, onClick:() => runAICommand(prompt, body) }, label)));
        body.appendChild(commands);
        // Tones
        const toneDiv = el("div", { style:{ marginBottom:"8px" } }); toneDiv.appendChild(el("label", { style:{ fontSize:"12px", fontWeight:"600", color:"#475569" } }, "Change Tone:"));
        const toneRow = el("div", { style:{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"4px" } });
        AI_TONES.forEach(tone => toneRow.appendChild(el("button", { className:"rte-popup-btn secondary", style:{ fontSize:"11px", padding:"3px 6px" }, onClick:() => runAICommand("Rewrite the following text in a "+tone.toLowerCase()+" tone:", body) }, tone)));
        toneDiv.appendChild(toneRow); body.appendChild(toneDiv);
        // Translate
        const transDiv = el("div", { style:{ marginBottom:"12px" } }); transDiv.appendChild(el("label", { style:{ fontSize:"12px", fontWeight:"600", color:"#475569" } }, "Translate to:"));
        const transRow = el("div", { style:{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"4px" } });
        AI_LANGUAGES.forEach(lang => transRow.appendChild(el("button", { className:"rte-popup-btn secondary", style:{ fontSize:"11px", padding:"3px 6px" }, onClick:() => runAICommand("Translate the following text to "+lang+". Return only the translation:", body) }, lang)));
        transDiv.appendChild(transRow); body.appendChild(transDiv);
        // Custom prompt
        body.appendChild(el("label", { style:{ fontSize:"12px", fontWeight:"600", color:"#475569" } }, "Ask AI Anything:"));
        const customPrompt = el("textarea", { style:{ width:"100%", minHeight:"60px", padding:"8px", border:"1px solid #d0d5dd", borderRadius:"6px", fontSize:"13px", fontFamily:"inherit", resize:"vertical", outline:"none", marginTop:"4px", boxSizing:"border-box" }, placeholder:"e.g. Make this more formal, Add bullet points..." });
        body.appendChild(customPrompt);
        body.appendChild(el("button", { className:"rte-popup-btn primary", style:{ marginTop:"8px", width:"100%" }, onClick:() => { if (customPrompt.value.trim()) runAICommand(customPrompt.value.trim(), body); } }, "\u{1F680} Run"));
        // Generate from prompt
        const genDiv = el("div", { style:{ marginTop:"12px", paddingTop:"12px", borderTop:"1px solid #e2e8f0" } });
        genDiv.appendChild(el("label", { style:{ fontSize:"12px", fontWeight:"600", color:"#475569" } }, "Generate from Prompt:"));
        const genPrompt = el("textarea", { style:{ width:"100%", minHeight:"60px", padding:"8px", border:"1px solid #d0d5dd", borderRadius:"6px", fontSize:"13px", fontFamily:"inherit", resize:"vertical", outline:"none", marginTop:"4px", boxSizing:"border-box" }, placeholder:"Describe what you want AI to write..." });
        genDiv.appendChild(genPrompt);
        genDiv.appendChild(el("button", { className:"rte-popup-btn primary", style:{ marginTop:"8px", width:"100%" }, onClick:() => { if (genPrompt.value.trim()) runAIGenerate(genPrompt.value.trim(), body); } }, "\u2728 Generate Content"));
        body.appendChild(genDiv);
        // Response area
        body.appendChild(el("div", { className:"rte-pro-ai-response", id:"ai-response-area", style:{ display:"none" } }));
        body.appendChild(el("div", { className:"rte-pro-ai-actions", id:"ai-action-bar", style:{ display:"none" } }));
      });
    }

    const AI_SYSTEM = "You are an AI writing assistant embedded in a rich text editor. IMPORTANT: Always respond with clean, raw HTML suitable for a WYSIWYG editor contenteditable div. Use semantic HTML tags: <h1>-<h4>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <pre>, <a>, <table>, <tr>, <td>, <th>, <img>, <hr>, <br>, <span style=\"...\">. Do NOT use markdown formatting. Do NOT wrap your response in ```html code fences. Do NOT include <html>, <head>, <body>, or <style> tags — only inner content HTML. For layouts, use inline styles on divs/sections. Output ONLY the HTML content, no explanations.";

    const AI_PROVIDERS = {
      anthropic: {
        url(o) { return o.aiProxy || "https://api.anthropic.com/v1/messages"; },
        headers(o) { const h={"Content-Type":"application/json"}; if(!o.aiProxy){h["x-api-key"]=o.apiKey;h["anthropic-version"]="2023-06-01";h["anthropic-dangerous-direct-browser-access"]="true";} return h; },
        body(o, sys, user, stream) { const b={model:o.aiModel,max_tokens:4096,messages:[{role:"user",content:user}]}; if(sys)b.system=sys; if(stream)b.stream=true; return b; },
        extractStreamText(p) { return (p.type==="content_block_delta"&&p.delta?.text)?p.delta.text:null; },
        extractResponseText(d) { return d.content?.[0]?.text||""; }
      },
      openai: {
        url(o) { return o.aiProxy || "https://api.openai.com/v1/chat/completions"; },
        headers(o) { const h={"Content-Type":"application/json"}; if(!o.aiProxy) h["Authorization"]="Bearer "+o.apiKey; return h; },
        body(o, sys, user, stream) { const m=[]; if(sys)m.push({role:"system",content:sys}); m.push({role:"user",content:user}); const b={model:o.aiModel,max_tokens:4096,messages:m}; if(stream)b.stream=true; return b; },
        extractStreamText(p) { return p.choices?.[0]?.delta?.content||null; },
        extractResponseText(d) { return d.choices?.[0]?.message?.content||""; }
      },
      gemini: {
        url(o) { if(o.aiProxy) return o.aiProxy; return "https://generativelanguage.googleapis.com/v1beta/models/"+o.aiModel+":streamGenerateContent?alt=sse&key="+encodeURIComponent(o.apiKey); },
        urlNonStream(o) { if(o.aiProxy) return o.aiProxy; return "https://generativelanguage.googleapis.com/v1beta/models/"+o.aiModel+":generateContent?key="+encodeURIComponent(o.apiKey); },
        headers(o) { return {"Content-Type":"application/json"}; },
        body(o, sys, user, stream) { const b={contents:[{role:"user",parts:[{text:user}]}]}; if(sys)b.systemInstruction={parts:[{text:sys}]}; if(o.aiProxy){b.model=o.aiModel; if(stream)b.stream=true;} return b; },
        extractStreamText(p) { return p.candidates?.[0]?.content?.parts?.[0]?.text||null; },
        extractResponseText(d) { return d.candidates?.[0]?.content?.parts?.[0]?.text||""; }
      }
    };

    function stripDocumentTags(html) {
      // Remove code fences
      html = html.replace(/^```html?\s*\n?/i, "").replace(/\n?```\s*$/,"");
      // Remove doctype, html, head, meta, title, style, body tags — keep only inner content
      html = html.replace(/<!DOCTYPE[^>]*>/gi, "");
      html = html.replace(/<\/?html[^>]*>/gi, "");
      html = html.replace(/<head[\s\S]*?<\/head>/gi, "");
      html = html.replace(/<\/?body[^>]*>/gi, "");
      html = html.replace(/<style[\s\S]*?<\/style>/gi, "");
      html = html.replace(/<meta[^>]*>/gi, "");
      html = html.replace(/<title[\s\S]*?<\/title>/gi, "");
      html = html.replace(/<link[^>]*>/gi, "");
      return html.trim();
    }
    function aiResponseToHTML(text) {
      // Strip code fences
      text = text.replace(/^```html?\s*\n?/i, "").replace(/\n?```\s*$/,"");
      // Strip document-level tags
      text = stripDocumentTags(text);
      // If it looks like HTML, return it
      if (text.trim().startsWith("<") && /<\/(p|div|h[1-6]|ul|ol|table|section|blockquote)>/i.test(text)) return text;
      // Otherwise convert markdown to HTML
      return markdownToHtml(text);
    }

    async function runAICommand(systemPrompt, panelBodyRef) {
      const selectedText = window.getSelection().toString();
      const textToProcess = selectedText || content.innerText;
      if (!textToProcess.trim()) { showToast("No text selected or available"); return; }
      const responseArea = panelBodyRef.querySelector("#ai-response-area"); const actionBar = panelBodyRef.querySelector("#ai-action-bar");
      if (!responseArea || !actionBar) return;
      responseArea.style.display = "block"; responseArea.textContent = "Generating..."; actionBar.style.display = "none";
      aiStatusEl.textContent = "AI: Generating..."; aiStatusEl.style.color = "#f59e0b"; savedRange = saveSelection();
      try {
        aiAbortController = new AbortController();
        const provider = AI_PROVIDERS[options.aiProvider] || AI_PROVIDERS.anthropic;
        const bodyObj = provider.body(options, AI_SYSTEM, systemPrompt+"\n\n"+textToProcess, true);
        if (options.aiProxy) bodyObj._provider = options.aiProvider || "anthropic";
        const response = await fetch(provider.url(options), {
          method:"POST", signal: aiAbortController.signal,
          headers: provider.headers(options),
          body: JSON.stringify(bodyObj)
        });
        if (!response.ok) throw new Error("API error: " + response.status);
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let fullText = ""; responseArea.textContent = "";
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          const chunk = decoder.decode(value, { stream:true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) { const data = line.slice(6); if (data === "[DONE]") break;
              try { const p = JSON.parse(data); const text = provider.extractStreamText(p); if (text) { fullText += text; responseArea.textContent = fullText; responseArea.scrollTop = responseArea.scrollHeight; } } catch(e) {} }
          }
        }
        aiStatusEl.textContent = "AI: Ready"; aiStatusEl.style.color = "#22c55e";
        const htmlToInsert = aiResponseToHTML(fullText);
        // Show rendered preview
        responseArea.innerHTML = htmlToInsert;
        actionBar.style.display = "flex"; actionBar.innerHTML = "";
        actionBar.append(
          el("button", { className:"rte-popup-btn primary", onClick:() => { restoreSelection(savedRange); exec("insertHTML", htmlToInsert); responseArea.style.display="none"; actionBar.style.display="none"; showToast("AI content accepted"); } }, "\u2705 Accept"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => { responseArea.style.display="none"; actionBar.style.display="none"; } }, "\u274C Reject"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => { responseArea.textContent = fullText; } }, "\u{1F4C4} Raw"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => runAICommand(systemPrompt, panelBodyRef) }, "\u{1F504} Retry")
        );
      } catch(err) {
        responseArea.textContent = err.name === "AbortError" ? "Generation cancelled." : "Error: "+err.message;
        aiStatusEl.textContent = "AI: Error"; aiStatusEl.style.color = "#ef4444";
      }
    }

    async function runAIGenerate(prompt, panelBodyRef) {
      const responseArea = panelBodyRef.querySelector("#ai-response-area"); const actionBar = panelBodyRef.querySelector("#ai-action-bar");
      if (!responseArea || !actionBar) return;
      responseArea.style.display = "block"; responseArea.textContent = "Generating..."; actionBar.style.display = "none";
      aiStatusEl.textContent = "AI: Generating..."; aiStatusEl.style.color = "#f59e0b"; savedRange = saveSelection();
      try {
        aiAbortController = new AbortController();
        const provider = AI_PROVIDERS[options.aiProvider] || AI_PROVIDERS.anthropic;
        const bodyObj = provider.body(options, AI_SYSTEM, prompt, true);
        if (options.aiProxy) bodyObj._provider = options.aiProvider || "anthropic";
        const response = await fetch(provider.url(options), {
          method:"POST", signal:aiAbortController.signal,
          headers: provider.headers(options),
          body: JSON.stringify(bodyObj)
        });
        if (!response.ok) throw new Error("API error: " + response.status);
        const reader = response.body.getReader(); const decoder = new TextDecoder(); let fullText = ""; responseArea.textContent = "";
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          const chunk = decoder.decode(value, { stream:true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("data: ")) { const data = line.slice(6); if (data === "[DONE]") break;
              try { const p = JSON.parse(data); const text = provider.extractStreamText(p); if (text) { fullText += text; responseArea.textContent = fullText; responseArea.scrollTop = responseArea.scrollHeight; } } catch(e) {} }
          }
        }
        aiStatusEl.textContent = "AI: Ready"; aiStatusEl.style.color = "#22c55e";
        const htmlToInsert = aiResponseToHTML(fullText);
        responseArea.innerHTML = htmlToInsert;
        actionBar.style.display = "flex"; actionBar.innerHTML = "";
        actionBar.append(
          el("button", { className:"rte-popup-btn primary", onClick:() => { restoreSelection(savedRange); exec("insertHTML", htmlToInsert); responseArea.style.display="none"; actionBar.style.display="none"; showToast("AI content inserted"); } }, "\u2705 Insert"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => { responseArea.style.display="none"; actionBar.style.display="none"; } }, "\u274C Discard"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => { responseArea.textContent = fullText; } }, "\u{1F4C4} Raw"),
          el("button", { className:"rte-popup-btn secondary", onClick:() => runAIGenerate(prompt, panelBodyRef) }, "\u{1F504} Retry")
        );
      } catch(err) {
        responseArea.textContent = err.name === "AbortError" ? "Generation cancelled." : "Error: "+err.message;
        aiStatusEl.textContent = "AI: Error"; aiStatusEl.style.color = "#ef4444";
      }
    }

    // ── Toolbar groups ──
    const toolbarGroups = {
      format: [tipWrap(headingSelect,"Block Format"), tipWrap(fontSelect,"Font Family"), tipWrap(sizeSelect,"Font Size")],
      text: [boldBtn, italicBtn, underlineBtn, strikeBtn, supBtn, subBtn],
      color: [
        btn("\u{1F3A8}","Text Color",() => togglePopup(textColorPopup)),
        btn("\u{1F58D}\uFE0F","Highlight",() => togglePopup(bgColorPopup)),
        btn("\u{1FA63}","Block Background",() => togglePopup(blockBgPopup)),
        btn("\u{1F5BC}\uFE0F","Editor Background",() => togglePopup(editorBgPopup))
      ],
      align: [
        btn(alignIcon("left"),"Align Left",() => exec("justifyLeft")),
        btn(alignIcon("center"),"Align Center",() => exec("justifyCenter")),
        btn(alignIcon("right"),"Align Right",() => exec("justifyRight")),
        btn(alignIcon("justify"),"Justify",() => exec("justifyFull"))
      ],
      list: [
        btn("\u{1F4DD}","Bullet List",() => exec("insertUnorderedList")),
        btn("\u{1F522}","Numbered List",() => exec("insertOrderedList")),
        btn("\u2611\uFE0F","Checklist",() => insertChecklist()),
        btn("\u27A1\uFE0F","Indent",() => exec("indent")),
        btn("\u2B05\uFE0F","Outdent",() => exec("outdent"))
      ],
      insert: [
        btn("\u{1F517}","Insert Link",() => togglePopup(linkPopup)),
        btn("\u26D3\uFE0F","Unlink",() => exec("unlink")),
        btn("\u{1F5BC}\uFE0F","Insert Image",() => togglePopup(imagePopup)),
        btn("\u{1F3AC}","Insert Video",() => togglePopup(videoPopup)),
        btn("\u{1F50A}","Insert Audio",() => togglePopup(audioPopup)),
        btn("\u{1F600}","Insert Emoji",() => togglePopup(emojiPopup)),
        btn("\u{1F4CA}","Insert Table",() => togglePopup(tablePopup)),
        btn("\u270F\uFE0F","Special Characters",() => togglePopup(specialCharPopup))
      ],
      block: [
        btn("\u{1F4AC}","Blockquote",() => exec("formatBlock","<blockquote>")),
        btn("\u{1F4BB}","Code Block",() => exec("formatBlock","<pre>")),
        btn("\u2796","Horizontal Rule",() => exec("insertHorizontalRule")),
        btn("\u{1F4C4}","Page Break",() => exec("insertHTML",'<div class="rte-pro-page-break"></div><p><br></p>')),
        btn("\u258C\u258C","2 Columns",() => insertColumns(2)),
        btn("\u258C\u258C\u258C","3 Columns",() => insertColumns(3))
      ],
      style: [
        btn("AB","Uppercase",() => { const t=window.getSelection().toString(); if(t) exec("insertHTML",'<span style="text-transform:uppercase">'+t+'</span>'); }),
        btn("ab","Lowercase",() => { const t=window.getSelection().toString(); if(t) exec("insertHTML",'<span style="text-transform:lowercase">'+t+'</span>'); }),
        btn("Ab","Capitalize",() => { const t=window.getSelection().toString(); if(t) exec("insertHTML",'<span style="text-transform:capitalize">'+t+'</span>'); }),
        btn("Sc","Small Caps",() => { const t=window.getSelection().toString(); if(t) exec("insertHTML",'<span style="font-variant:small-caps">'+t+'</span>'); }),
        btn("\u2600","Text Shadow",() => togglePopup(textShadowPopup)),
        btn("\u{1F308}","Gradient Text",() => togglePopup(gradientPopup)),
        btn("\u25A2","Borders",() => togglePopup(bordersPopup)),
        tipWrap(lineSpacingSelect,"Line Spacing"),
        tipWrap(letterSpacingSelect,"Letter Spacing")
      ],
      direction: [
        btn("\u2B05\uFE0F","LTR",() => { const b=getContainingBlock(window.getSelection().anchorNode,content); if(b) b.setAttribute("dir","ltr"); }),
        btn("\u27A1\uFE0F","RTL",() => { const b=getContainingBlock(window.getSelection().anchorNode,content); if(b) b.setAttribute("dir","rtl"); })
      ],
      tools: [
        btn("\u2702\uFE0F","Cut (Ctrl+X)",() => editorCut()),
        btn("\u{1F4CB}","Copy (Ctrl+C)",() => editorCopy()),
        btn("\u{1F4CC}","Paste (Ctrl+V)",() => editorPaste()),
        btn("\u{1F50D}","Find & Replace (Ctrl+F)",() => toggleFindBar()),
        btn("&lt;/&gt;","Source View (Ctrl+/)",() => toggleSourceView()),
        btn("\u24C2","Markdown Toggle",() => toggleMarkdown()),
        btn("\u26F6","Fullscreen (F11)",() => toggleFullscreen())
      ],
      history: [
        btn("\u21A9\uFE0F","Undo (Ctrl+Z)",() => customUndo()),
        btn("\u21AA\uFE0F","Redo (Ctrl+Y)",() => customRedo()),
        btn("\u{1F4CB}","Undo History",() => togglePanel("undoHistory")),
        btn("\u{1F553}","Version History",() => togglePanel("versionHistory"))
      ],
      cleanup: [
        btn("\u{1F9F9}","Clear Formatting",() => exec("removeFormat")),
        btn("\u{1F5D1}\uFE0F","Clear All",() => { if(confirm("Clear all content?")) { content.innerHTML=""; updateStatus(); } })
      ],
      advanced: [
        btn("\u2693","Anchor/Bookmark",() => togglePopup(anchorPopup)),
        btn("\u00B9","Footnote",() => insertFootnote()),
        btn("\u{1F4D1}","Table of Contents",() => insertTOC()),
        btn("\u2211","Math/LaTeX",() => togglePopup(mathPopup))
      ],
      mode: [
        btn("\u{1F3AF}","Focus Mode",() => toggleFocusMode()),
        btn("\u{1F4D6}","Spellcheck Toggle",() => { const v = content.getAttribute("spellcheck")==="true"; content.setAttribute("spellcheck",!v); showToast("Spellcheck: "+(!v?"On":"Off")); }),
        btn("\u{1F4A7}","Watermark",() => { const t=prompt("Enter watermark text (empty to remove):"); setWatermark(t); }),
        btn("\u{1F4D0}","Gridlines",() => toggleGridlines())
      ],
      analysis: [
        btn("\u{1F4CA}","Readability Score",() => togglePanel("readability")),
        btn("\u{1F50E}","SEO Check",() => togglePanel("seo")),
        btn("\u267F","Accessibility Check",() => togglePanel("accessibility"))
      ],
      ai: [btn("\u{1F916}","AI Assistant",() => togglePanel("ai"))]
    };

    // Render toolbar
    const enabledGroups = options.toolbar || Object.keys(toolbarGroups);
    enabledGroups.forEach((groupName, index) => {
      const items = toolbarGroups[groupName]; if (!items) return;
      items.forEach(item => toolbar.appendChild(item));
      if (index < enabledGroups.length - 1) toolbar.appendChild(sep());
    });

    // ── Floating / Bubble Toolbar ──
    const bubbleToolbar = el("div", { className: "rte-bubble-toolbar" });
    function bubbleBtn(label, tip, cmd) {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = label; b.title = tip;
      b.addEventListener("click", () => { exec(cmd); });
      return b;
    }
    const bubbleLinkBtn = document.createElement("button");
    bubbleLinkBtn.type = "button"; bubbleLinkBtn.textContent = "\u{1F517}"; bubbleLinkBtn.title = "Link";
    bubbleLinkBtn.style.fontFamily = "inherit";
    bubbleLinkBtn.addEventListener("click", () => {
      const url = prompt("Enter URL:");
      if (url) exec("createLink", url);
    });
    const bubbleHighBtn = document.createElement("button");
    bubbleHighBtn.type = "button"; bubbleHighBtn.textContent = "\u{1F58D}"; bubbleHighBtn.title = "Highlight";
    bubbleHighBtn.style.fontFamily = "inherit";
    bubbleHighBtn.addEventListener("click", () => { exec("hiliteColor", "#fef08a"); });
    bubbleToolbar.append(
      bubbleBtn("B", "Bold", "bold"),
      bubbleBtn("I", "Italic", "italic"),
      bubbleBtn("U", "Underline", "underline"),
      bubbleLinkBtn,
      bubbleHighBtn
    );
    // Style the B/I/U buttons
    bubbleToolbar.children[0].style.fontWeight = "900";
    bubbleToolbar.children[1].style.fontStyle = "italic";
    bubbleToolbar.children[2].style.textDecoration = "underline";
    // Prevent mousedown from collapsing selection
    bubbleToolbar.addEventListener("mousedown", e => e.preventDefault());

    function showBubbleToolbar() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) { hideBubbleToolbar(); return; }
      // Only show if selection is inside our content area
      const anchor = sel.anchorNode;
      if (!anchor || !content.contains(anchor)) { hideBubbleToolbar(); return; }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      if (rect.width === 0) { hideBubbleToolbar(); return; }
      const left = rect.left - wrapRect.left + rect.width / 2 - bubbleToolbar.offsetWidth / 2;
      const top = rect.top - wrapRect.top - bubbleToolbar.offsetHeight - 8;
      bubbleToolbar.style.left = Math.max(4, left) + "px";
      bubbleToolbar.style.top = Math.max(4, top) + "px";
      bubbleToolbar.classList.add("show");
    }
    function hideBubbleToolbar() { bubbleToolbar.classList.remove("show"); }

    // ── AI Ghost Text Autocomplete ──
    let ghostSpan = null, ghostTimeout = null, ghostSuppressed = false, ghostAbortController = null;
    function dismissGhost() {
      if (ghostSpan) { ghostSpan.remove(); ghostSpan = null; }
      const hint = content.querySelector(".rte-pro-ghost-hint");
      if (hint) hint.remove();
      if (ghostAbortController) { ghostAbortController.abort(); ghostAbortController = null; }
    }
    function acceptGhost() {
      if (!ghostSpan) return;
      const text = ghostSpan.textContent;
      const parent = ghostSpan.parentNode;
      const textNode = document.createTextNode(text);
      parent.replaceChild(textNode, ghostSpan);
      ghostSpan = null;
      const hint = content.querySelector(".rte-pro-ghost-hint");
      if (hint) hint.remove();
      // Place cursor after inserted text
      const sel = window.getSelection();
      const range = document.createRange();
      range.setStartAfter(textNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      updateStatus();
    }
    function fetchGhostSuggestion() {
      console.log("RTEPro ghost: triggered", { aiAutocomplete: options.aiAutocomplete, hasProxy: !!options.aiProxy, hasKey: !!options.apiKey, suppressed: ghostSuppressed });
      if (!options.aiAutocomplete || (!options.apiKey && !options.aiProxy)) return;
      if (ghostSuppressed) return;
      dismissGhost();
      // Get paragraph context around cursor
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount || !sel.isCollapsed) { console.log("RTEPro ghost: no valid selection"); return; }
      // Make sure cursor is inside our editor
      const anchorEl = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if (!anchorEl || !content.contains(anchorEl)) { console.log("RTEPro ghost: cursor not in editor"); return; }
      const block = getContainingBlock(sel.anchorNode, content) || content;
      const blockText = block.textContent.trim();
      if (blockText.length < 10) { console.log("RTEPro ghost: block too short:", blockText.length); return; }
      console.log("RTEPro ghost: fetching, context length:", blockText.length);
      // Save cursor position for later insertion
      const savedGhostRange = sel.getRangeAt(0).cloneRange();
      // Get broader context (previous blocks too)
      let context = "";
      let prev = block.previousElementSibling;
      let count = 0;
      while (prev && count < 3) { context = prev.textContent.trim() + "\n" + context; prev = prev.previousElementSibling; count++; }
      context += blockText;
      ghostAbortController = new AbortController();
      const provider = AI_PROVIDERS[options.aiProvider] || AI_PROVIDERS.anthropic;
      const url = (provider.urlNonStream || provider.url)(options);
      const sysPrompt = "You are an inline text autocomplete assistant. Given the text context, suggest a brief natural continuation (1-2 short sentences max). Reply ONLY with the continuation text, no quotes, no explanation, no markdown.";
      const bodyObj = provider.body(options, sysPrompt, "Continue this text naturally:\n\n" + context, false);
      if (options.aiProxy) bodyObj._provider = options.aiProvider || "anthropic";
      console.log("RTEPro ghost: sending fetch to", url);
      fetch(url, { method: "POST", headers: provider.headers(options), body: JSON.stringify(bodyObj), signal: ghostAbortController.signal })
        .then(resp => { console.log("RTEPro ghost: response status", resp.status); if (!resp.ok) throw new Error("API " + resp.status); return resp.json(); })
        .then(data => {
          const suggestion = provider.extractResponseText(data).trim();
          console.log("RTEPro ghost: suggestion", suggestion ? suggestion.substring(0, 50) + "..." : "(empty)");
          if (!suggestion) return;
          // Use saved range to insert ghost — cursor may have moved but if editor still focused, insert
          try {
            ghostSpan = document.createElement("span");
            ghostSpan.className = "rte-pro-ghost";
            ghostSpan.contentEditable = "false";
            ghostSpan.textContent = " " + suggestion;
            // Try current cursor first, fall back to saved range
            const currentSel = window.getSelection();
            const insertRange = (currentSel && currentSel.rangeCount && currentSel.isCollapsed && content.contains(currentSel.anchorNode))
              ? currentSel.getRangeAt(0) : savedGhostRange;
            insertRange.insertNode(ghostSpan);
            // Add hint label
            const hint = document.createElement("span");
            hint.className = "rte-pro-ghost-hint";
            hint.contentEditable = "false";
            hint.textContent = "Tab";
            ghostSpan.parentNode.insertBefore(hint, ghostSpan.nextSibling);
            // Move cursor before ghost span
            const newRange = document.createRange();
            newRange.setStartBefore(ghostSpan);
            newRange.collapse(true);
            if (currentSel) { currentSel.removeAllRanges(); currentSel.addRange(newRange); }
          } catch(e) { dismissGhost(); }
        })
        .catch(err => { if (err.name !== "AbortError") console.warn("RTEPro ghost autocomplete:", err.message); });
    }
    const debouncedGhostFetch = debounce(fetchGhostSuggestion, 1500);

    // ── Export helpers ──
    function cleanHTML() {
      const clone = content.cloneNode(true);
      clone.querySelectorAll(".rte-pro-ghost, .rte-pro-ghost-hint").forEach(h => h.remove());
      clone.querySelectorAll(".rte-pro-drag-handle, .rte-pro-col-handle").forEach(h => h.remove());
      clone.querySelectorAll("[class]").forEach(el => {
        const keep = new Set(["rte-pro-cols","rte-pro-cols-2","rte-pro-cols-3","rte-pro-col","rte-pro-page-break","rte-pro-mention","rte-checklist","checked"]);
        const classes = Array.from(el.classList).filter(c => keep.has(c) || (!c.startsWith("rte-pro-") && c !== "rte-img-resizing" && c !== "active-block"));
        if (!classes.length) el.removeAttribute("class"); else el.className = classes.join(" ");
      });
      clone.querySelectorAll(".rte-pro-cols").forEach(el => {
        el.style.cssText = "display:table;width:100%;border-spacing:12px;table-layout:fixed";
      });
      clone.querySelectorAll(".rte-pro-col").forEach(el => {
        el.style.cssText = "display:table-cell;padding:12px;border:1px solid #d0d5dd;border-radius:4px;vertical-align:top";
      });
      clone.querySelectorAll(".rte-pro-page-break").forEach(el => {
        el.style.cssText = "border-top:2px dashed #94a3b8;margin:16px 0;page-break-after:always";
      });
      clone.querySelectorAll(".rte-pro-mention").forEach(el => {
        el.style.cssText = "background:#ede9fe;color:#6366f1;padding:1px 4px;border-radius:3px;font-weight:500";
      });
      clone.querySelectorAll("ul.rte-checklist").forEach(el => {
        el.style.cssText = "list-style:none;padding-left:4px";
      });
      clone.querySelectorAll("ul.rte-checklist li").forEach(el => {
        el.style.cssText = "display:flex;align-items:flex-start;gap:8px;padding:2px 0";
        const isChecked = el.classList.contains("checked");
        const box = document.createElement("span");
        box.style.cssText = "display:inline-block;width:18px;height:18px;min-width:18px;margin-top:3px;border:2px solid "+(isChecked?"#6366f1":"#94a3b8")+";border-radius:4px;background:"+(isChecked?"#6366f1":"#fff");
        if (isChecked) { el.style.textDecoration = "line-through"; el.style.color = "#94a3b8"; box.textContent = "\u2713"; box.style.color = "#fff"; box.style.textAlign = "center"; box.style.fontSize = "12px"; box.style.lineHeight = "18px"; }
        el.insertBefore(box, el.firstChild);
      });
      clone.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));
      clone.querySelectorAll("[data-rte-tag]").forEach(el => el.removeAttribute("data-rte-tag"));
      clone.querySelectorAll("mark.rte-pro-highlight-match, mark.rte-pro-highlight-current").forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
      var html = stripDocumentTags(clone.innerHTML);
      if (content.style.backgroundColor) html = '<div style="background-color:'+content.style.backgroundColor+'">'+html+'</div>';
      return html;
    }
    function cleanText() {
      const clone = content.cloneNode(true);
      clone.querySelectorAll(".rte-pro-drag-handle, .rte-pro-col-handle").forEach(h => h.remove());
      return clone.innerText;
    }
    function getFullHTML() {
      if (options.exportTemplate) return options.exportTemplate.replace('{{content}}', cleanHTML());
      var css = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px 32px;line-height:1.7;color:#1e293b}img,video{max-width:100%;border-radius:8px}audio{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d0d5dd;padding:8px 12px;text-align:left}th{background:#f8f9fb;font-weight:600}blockquote{border-left:4px solid #6366f1;margin:.6em 0;padding:.4em .8em;background:#f1f5f9}pre{background:#1e293b;color:#e2e8f0;padding:12px 16px;border-radius:8px;overflow-x:auto;font-size:13px}a{color:#6366f1}hr{border:none;border-top:2px dashed #d0d5dd;margin:1em 0}.rte-pro-cols{display:grid;gap:12px;margin:8px 0}.rte-pro-cols-2{grid-template-columns:1fr 1fr}.rte-pro-cols-3{grid-template-columns:1fr 1fr 1fr}.rte-pro-col{padding:12px;border:1px solid #d0d5dd;border-radius:4px;min-height:60px}.rte-pro-page-break{border-top:2px dashed #94a3b8;margin:16px 0;page-break-after:always}.rte-pro-mention{background:#ede9fe;color:#6366f1;padding:1px 4px;border-radius:3px;font-weight:500}';
      if (options.exportCSS) css += options.exportCSS;
      return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>'+css+'</style></head><body>'+cleanHTML()+'</body></html>';
    }

    // ── Export bar ──
    const exportBar = el("div", { className:"rte-exportbar" });
    const filenameInput = el("input", { className:"rte-filename-input", type:"text", placeholder:"document", title:"Export filename (without extension)" });
    function getFilename(ext) { const base = filenameInput.value.trim().replace(/\.[^.]+$/, "") || "document"; return base + ext; }
    function exportBtn(icon, label, tip, onClick) { const b = el("button", { className:"rte-export-btn", title:tip, onClick }); b.innerHTML = '<span class="rte-export-icon">'+icon+'</span> '+label; return b; }
    exportBar.append(
      filenameInput,
      exportBtn("\u{1F4BE}","Save HTML","Download as HTML",() => { const b=new Blob([getFullHTML()],{type:"text/html"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=getFilename(".html"); a.click(); URL.revokeObjectURL(a.href); showToast("\u2705 HTML file downloaded"); }),
      exportBtn("\u{1F4C4}","Save Text","Download as text",() => { const b=new Blob([cleanText()],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=getFilename(".txt"); a.click(); URL.revokeObjectURL(a.href); showToast("\u2705 Text file downloaded"); }),
      exportBtn("\u{1F4CB}","Copy HTML","Copy rich HTML",() => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write){navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]).then(()=>showToast("\u2705 HTML copied"));}else{navigator.clipboard.writeText(h).then(()=>showToast("\u2705 HTML copied"));} }),
      exportBtn("\u{1F4DD}","Copy Text","Copy plain text",() => { navigator.clipboard.writeText(cleanText()).then(()=>showToast("\u2705 Text copied")); }),
      exportBtn("\u2709\uFE0F","Email","Copy for email",() => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write){navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]).then(()=>showToast("\u2705 Content copied \u2014 paste into email"));}else{navigator.clipboard.writeText(t).then(()=>showToast("\u2705 Text copied"));} }),
      exportBtn("\u{1F5A8}\uFE0F","Print","Print or save as PDF",() => { const w=window.open("","_blank"); w.document.write(getFullHTML()); w.document.close(); w.print(); }),
      exportBtn("\u{1F4BE}","JSON","Copy as JSON",() => { const json=JSON.stringify({ html:cleanHTML(), text:cleanText(), wordCount:(cleanText().trim()?cleanText().trim().split(/\s+/).length:0), charCount:cleanText().length, createdAt:new Date().toISOString() },null,2); navigator.clipboard.writeText(json).then(()=>showToast("\u2705 JSON copied")); })
    );

    // ── Assemble ──
    wrap.append(toolbar);
    wrap.appendChild(bubbleToolbar);
    allPopups.forEach(p => wrap.appendChild(p));
    _dragWrap.append(content);
    wrap.append(_dragWrap, panelContainer, exportBar, statusbar, toast);
    target.appendChild(wrap);

    // ── Status updates ──
    function updateStatus() {
      const text = content.innerText || ""; const words = text.trim() ? text.trim().split(/\s+/).length : 0; const chars = text.length;
      wordCountEl.textContent = "\u{1F4DD} Words: " + words; charCountEl.textContent = "\u{1F524} Chars: " + chars;
      readingTimeEl.textContent = "\u{1F4D6} ~" + Math.ceil(words / 200) + " min read";
      if (options.wordGoal > 0) { const pct = Math.min(100, Math.round(words/options.wordGoal*100)); const bar = wrap.querySelector(".rte-pro-word-progress"); if (bar) bar.style.width = pct+"%"; const lbl = wrap.querySelector(".rte-pro-word-goal-label"); if (lbl) lbl.textContent = words+"/"+options.wordGoal+" words ("+pct+"%)"; }
      if (options.charGoal > 0) { const pct = Math.min(100, Math.round(chars/options.charGoal*100)); const bar = wrap.querySelector(".rte-pro-char-progress"); if (bar) bar.style.width = pct+"%"; const lbl = wrap.querySelector(".rte-pro-char-goal-label"); if (lbl) lbl.textContent = chars+"/"+options.charGoal+" chars ("+pct+"%)"; }
      try { if (typeof api !== "undefined" && typeof api.onChange === "function") api.onChange({ html:content.innerHTML, text:text, words:words, chars:chars }); } catch(e) {}
    }
    content.addEventListener("input", () => { updateStatus(); ghostSuppressed = false; if (options.aiAutocomplete) debouncedGhostFetch(); });
    content.addEventListener("keyup", () => { updateStatus(); updateActiveStates(); });
    content.addEventListener("keydown", hideBubbleToolbar);
    content.addEventListener("mousedown", hideBubbleToolbar);
    content.addEventListener("mouseup", () => { updateActiveStates(); setTimeout(showBubbleToolbar, 10); });
    new MutationObserver(updateStatus).observe(content, { childList:true, subtree:true, characterData:true, attributes:true });

    // ── Word/char goal progress bars ──
    if (options.wordGoal > 0 || options.charGoal > 0) {
      const goalsDiv = el("div", { style:{ padding:"4px 12px", background:"var(--rte-toolbar-bg)", borderTop:"1px solid var(--rte-border)", fontSize:"11px", color:"#64748b" } });
      if (options.wordGoal > 0) {
        goalsDiv.append(el("span", { className:"rte-pro-word-goal-label" }, "0/"+options.wordGoal+" words (0%)"), el("div", { className:"rte-pro-progress", style:{ marginTop:"2px", marginBottom:"4px" } }, [el("div", { className:"rte-pro-progress-fill rte-pro-word-progress", style:{ width:"0%" } })]));
      }
      if (options.charGoal > 0) {
        goalsDiv.append(el("span", { className:"rte-pro-char-goal-label" }, "0/"+options.charGoal+" chars (0%)"), el("div", { className:"rte-pro-progress", style:{ marginTop:"2px" } }, [el("div", { className:"rte-pro-progress-fill rte-pro-char-progress", style:{ width:"0%" } })]));
      }
      statusbar.parentNode.insertBefore(goalsDiv, statusbar);
    }

    // ── Keyboard shortcuts ──
    content.addEventListener("keydown", e => {
      // AI ghost text: Tab to accept
      if (e.key === "Tab" && ghostSpan) {
        e.preventDefault();
        acceptGhost();
        return;
      }
      // Tab navigation inside tables
      if (e.key === "Tab") {
        const sel = window.getSelection();
        const cell = sel && sel.anchorNode
          ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest("td, th")
          : null;
        if (cell) {
          e.preventDefault();
          const row = cell.parentElement;
          const table = cell.closest("table");
          const allCells = Array.from(table.querySelectorAll("td, th"));
          const idx = allCells.indexOf(cell);
          let target;
          if (e.shiftKey) {
            // Previous cell
            target = allCells[idx - 1] || null;
          } else {
            target = allCells[idx + 1] || null;
            // At last cell: add a new row and move into it
            if (!target) {
              const colCount = row.children.length;
              const newRow = document.createElement("tr");
              for (let c = 0; c < colCount; c++) {
                const td = document.createElement("td");
                td.innerHTML = "&nbsp;";
                newRow.appendChild(td);
              }
              (table.querySelector("tbody") || table).appendChild(newRow);
              target = newRow.firstChild;
              updateStatus();
            }
          }
          if (target) {
            const range = document.createRange();
            range.selectNodeContents(target);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "b": e.preventDefault(); exec("bold"); break;
          case "i": e.preventDefault(); exec("italic"); break;
          case "u": e.preventDefault(); exec("underline"); break;
          case "s": e.preventDefault(); var blob=new Blob([getFullHTML()],{type:"text/html"}); var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=getFilename(".html"); a.click(); URL.revokeObjectURL(a.href); showToast("\u2705 Saved"); break;
          case "f": if (!e.shiftKey) { e.preventDefault(); toggleFindBar(); } else { e.preventDefault(); toggleFullscreen(); } break;
          case "/": e.preventDefault(); toggleSourceView(); break;
          case "z": e.preventDefault(); if (e.shiftKey) { customRedo(); } else { customUndo(); } break;
          case "x": if (resizeImg) { e.preventDefault(); editorCut(); } break;
          case "c": if (resizeImg) { e.preventDefault(); editorCopy(); } break;
          case "y": e.preventDefault(); customRedo(); break;
        }
        if (e.shiftKey) { if (e.key.toLowerCase() === "m") { e.preventDefault(); toggleMarkdown(); } if (e.key.toLowerCase() === "a") { e.preventDefault(); togglePanel("ai"); } }
      }
      if (e.key === "F11") { e.preventDefault(); toggleFullscreen(); }
      if (e.key === "Escape") { if (isFullscreen) toggleFullscreen(); closeSlashMenu(); closeMentionMenu(); closeFindBar(); closePanel(); dismissGhost(); ghostSuppressed = true; }
      // Dismiss ghost on any non-Tab key
      if (ghostSpan && e.key !== "Tab" && e.key !== "Escape") { dismissGhost(); }
      // Checklist Enter key handling
      if (e.key === "Enter" && !e.shiftKey) {
        const sel = window.getSelection();
        const li = sel && sel.anchorNode ? (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement).closest("ul.rte-checklist > li") : null;
        if (li) {
          e.preventDefault();
          const text = li.textContent.trim();
          if (!text) {
            // Empty li: exit checklist, insert paragraph after
            const ul = li.closest("ul.rte-checklist");
            li.remove();
            const p = document.createElement("p");
            p.innerHTML = "<br>";
            ul.parentNode.insertBefore(p, ul.nextSibling);
            const range = document.createRange();
            range.setStart(p, 0); range.collapse(true);
            sel.removeAllRanges(); sel.addRange(range);
          } else {
            // New checklist item
            const newLi = document.createElement("li");
            newLi.innerHTML = "<br>";
            li.parentNode.insertBefore(newLi, li.nextSibling);
            const range = document.createRange();
            range.setStart(newLi, 0); range.collapse(true);
            sel.removeAllRanges(); sel.addRange(range);
          }
          updateStatus();
        }
      }
    });

    // ── Drag & Drop media ──
    content.addEventListener("dragover", e => { if (!dragBlock) e.preventDefault(); });
    content.addEventListener("drop", e => {
      if (dragBlock) return; // handled by block drag
      e.preventDefault(); const files = e.dataTransfer.files; if (!files.length) return;
      Array.from(files).forEach(file => { const reader = new FileReader(); reader.onload = () => {
        if (file.type.startsWith("image/")) exec("insertHTML",'<img src="'+reader.result+'" alt="'+file.name+'">');
        else if (file.type.startsWith("video/")) exec("insertHTML",'<video src="'+reader.result+'" controls></video>');
        else if (file.type.startsWith("audio/")) exec("insertHTML",'<audio src="'+reader.result+'" controls></audio>');
      }; reader.readAsDataURL(file); });
    });

    // ── Paste image ──
    content.addEventListener("paste", e => {
      const items = (e.clipboardData || {}).items; if (!items) return;
      for (let i = 0; i < items.length; i++) { if (items[i].type.startsWith("image/")) { e.preventDefault(); const file = items[i].getAsFile(); const reader = new FileReader(); reader.onload = () => exec("insertHTML",'<img src="'+reader.result+'" alt="pasted image">'); reader.readAsDataURL(file); break; } }
    });

    // ── Image Resize ──
    let resizeOverlay = null, resizeImg = null, resizeDragging = false, resizeStartX = 0, resizeStartWidth = 0;
    function clearImageResize() { if (resizeOverlay) { resizeOverlay.remove(); resizeOverlay = null; } if (resizeImg) { resizeImg.classList.remove("rte-img-resizing"); resizeImg = null; } resizeDragging = false; }
    function positionOverlay() { if (!resizeOverlay || !resizeImg) return; const ir = resizeImg.getBoundingClientRect(), wr = wrap.getBoundingClientRect(); resizeOverlay.style.top=(ir.top-wr.top)+"px"; resizeOverlay.style.left=(ir.left-wr.left)+"px"; resizeOverlay.style.width=ir.width+"px"; resizeOverlay.style.height=ir.height+"px"; }
    function selectImageForResize(img) {
      clearImageResize(); resizeImg = img; img.classList.add("rte-img-resizing");
      resizeOverlay = document.createElement("div"); resizeOverlay.className = "rte-img-resize-overlay";
      ["nw","ne","sw","se"].forEach(pos => { const h = document.createElement("div"); h.className = "rte-img-resize-handle "+pos; h.addEventListener("mousedown", e => { e.preventDefault(); e.stopPropagation(); resizeDragging = true; resizeStartX = e.clientX; resizeStartWidth = resizeImg.getBoundingClientRect().width; }); resizeOverlay.appendChild(h); });
      wrap.appendChild(resizeOverlay); positionOverlay();
    }
    content.addEventListener("click", e => {
      if (e.target.tagName === "IMG") { e.preventDefault(); selectImageForResize(e.target); }
      // Checklist toggle: click on <li> inside .rte-checklist toggles checked
      const checkLi = e.target.closest("ul.rte-checklist > li");
      if (checkLi) {
        // Only toggle if clicking the li itself or the checkbox area (left side)
        const liRect = checkLi.getBoundingClientRect();
        if (e.clientX < liRect.left + 30) {
          e.preventDefault();
          checkLi.classList.toggle("checked");
          updateStatus();
        }
      }
    });
    document.addEventListener("mousemove", e => { if (!resizeDragging || !resizeImg) return; const nw = Math.max(20, resizeStartWidth + (e.clientX - resizeStartX)); resizeImg.style.width = nw+"px"; resizeImg.style.height = "auto"; positionOverlay(); });
    document.addEventListener("mouseup", () => { if (resizeDragging) { resizeDragging = false; updateStatus(); } });
    content.addEventListener("scroll", positionOverlay); content.addEventListener("input", positionOverlay);
    document.addEventListener("keydown", e => { if (!resizeImg) return; if (e.key === "Escape") clearImageResize(); else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); resizeImg.remove(); clearImageResize(); updateStatus(); } });

    updateStatus();

    // ── Table Resize System ─────────────────────────────────
    let tableResizing = false;
    let tableResizeType = null; // "col" or "row"
    let tableResizeStart = 0;
    let tableResizeCell = null;
    let tableResizeStartSize = 0;
    let tableResizeColIndex = -1;
    let tableResizeTable = null;

    const TABLE_BORDER_THRESHOLD = 4;

    function getTableBorderHit(e) {
      const target = e.target.closest ? e.target.closest("td, th") : null;
      if (!target) return null;
      const rect = target.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      // Check right edge for column resize
      if (Math.abs(x - rect.right) <= TABLE_BORDER_THRESHOLD) {
        return { type: "col", cell: target };
      }
      // Check left edge (resize previous column)
      if (Math.abs(x - rect.left) <= TABLE_BORDER_THRESHOLD) {
        const row = target.parentElement;
        const idx = Array.from(row.children).indexOf(target);
        if (idx > 0) {
          return { type: "col", cell: row.children[idx - 1] };
        }
        return null;
      }
      // Check bottom edge for row resize
      if (Math.abs(y - rect.bottom) <= TABLE_BORDER_THRESHOLD) {
        return { type: "row", cell: target };
      }
      // Check top edge (resize previous row)
      if (Math.abs(y - rect.top) <= TABLE_BORDER_THRESHOLD) {
        const row = target.parentElement;
        const prevRow = row.previousElementSibling;
        if (prevRow) {
          const idx = Array.from(row.children).indexOf(target);
          const prevCell = prevRow.children[idx] || prevRow.lastElementChild;
          if (prevCell) return { type: "row", cell: prevCell };
        }
        return null;
      }
      return null;
    }

    content.addEventListener("mousemove", (e) => {
      if (tableResizing) return;
      const hit = getTableBorderHit(e);
      content.classList.remove("rte-col-resize", "rte-row-resize");
      if (hit) {
        content.classList.add(hit.type === "col" ? "rte-col-resize" : "rte-row-resize");
      }
    });

    content.addEventListener("mousedown", (e) => {
      const hit = getTableBorderHit(e);
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();

      tableResizing = true;
      tableResizeType = hit.type;
      tableResizeCell = hit.cell;
      tableResizeTable = hit.cell.closest("table");

      if (hit.type === "col") {
        tableResizeStart = e.clientX;
        tableResizeStartSize = hit.cell.getBoundingClientRect().width;
        tableResizeColIndex = Array.from(hit.cell.parentElement.children).indexOf(hit.cell);
      } else {
        tableResizeStart = e.clientY;
        tableResizeStartSize = hit.cell.getBoundingClientRect().height;
      }

      content.classList.add("rte-table-resizing");
      content.classList.add(hit.type === "col" ? "rte-col-resize" : "rte-row-resize");
    });

    document.addEventListener("mousemove", (e) => {
      if (!tableResizing) return;

      if (tableResizeType === "col") {
        const delta = e.clientX - tableResizeStart;
        const newWidth = Math.max(30, tableResizeStartSize + delta);
        // Set table to fixed layout on first resize
        if (tableResizeTable.style.tableLayout !== "fixed") {
          // Snapshot all column widths before switching to fixed layout
          const firstRow = tableResizeTable.querySelector("tr");
          if (firstRow) {
            Array.from(firstRow.children).forEach((cell) => {
              cell.style.width = cell.getBoundingClientRect().width + "px";
            });
          }
          tableResizeTable.style.tableLayout = "fixed";
        }
        // Apply width to all cells in the same column
        const rows = tableResizeTable.querySelectorAll("tr");
        rows.forEach((row) => {
          const cell = row.children[tableResizeColIndex];
          if (cell) cell.style.width = newWidth + "px";
        });
        // Update table width to sum of columns
        const firstRow = tableResizeTable.querySelector("tr");
        if (firstRow) {
          let totalWidth = 0;
          Array.from(firstRow.children).forEach((cell) => {
            totalWidth += cell.getBoundingClientRect().width;
          });
          tableResizeTable.style.width = totalWidth + "px";
        }
      } else {
        const delta = e.clientY - tableResizeStart;
        const newHeight = Math.max(20, tableResizeStartSize + delta);
        // Apply height to all cells in the same row
        const row = tableResizeCell.parentElement;
        Array.from(row.children).forEach((cell) => {
          cell.style.height = newHeight + "px";
        });
      }
    });

    document.addEventListener("mouseup", () => {
      if (tableResizing) {
        tableResizing = false;
        tableResizeCell = null;
        tableResizeTable = null;
        content.classList.remove("rte-table-resizing", "rte-col-resize", "rte-row-resize");
        updateStatus();
      }
    });

    // ── Column layout resize ──
    let _colResizing = false, _colHandle = null, _colGrid = null, _colStartX = 0, _colWidths = [];
    content.addEventListener("mousedown", e => {
      const handle = e.target.closest(".rte-pro-col-handle");
      if (!handle) return;
      e.preventDefault(); e.stopPropagation();
      _colResizing = true; _colHandle = handle; _colGrid = handle.closest(".rte-pro-cols");
      handle.classList.add("active");
      _colStartX = e.clientX;
      const cols = Array.from(_colGrid.querySelectorAll(".rte-pro-col"));
      _colWidths = cols.map(c => c.getBoundingClientRect().width);
      const kids = Array.from(_colGrid.children);
      const hIdx = kids.indexOf(handle);
      _colHandle._leftIdx = kids.slice(0, hIdx).filter(k => k.classList.contains("rte-pro-col")).length - 1;
      _colHandle._rightIdx = _colHandle._leftIdx + 1;
    });
    document.addEventListener("mousemove", e => {
      if (!_colResizing) return;
      const delta = e.clientX - _colStartX;
      const li = _colHandle._leftIdx, ri = _colHandle._rightIdx;
      const newLeft = Math.max(60, _colWidths[li] + delta);
      const newRight = Math.max(60, _colWidths[ri] - delta);
      const widths = [..._colWidths];
      widths[li] = newLeft; widths[ri] = newRight;
      const parts = [];
      widths.forEach((w, i) => { if (i > 0) parts.push("6px"); parts.push(w + "px"); });
      _colGrid.style.gridTemplateColumns = parts.join(" ");
    });
    document.addEventListener("mouseup", () => {
      if (!_colResizing) return;
      _colResizing = false;
      if (_colHandle) _colHandle.classList.remove("active");
      _colHandle = null; _colGrid = null;
      updateStatus();
    });

    // ── Public API ──
    const api = {
      getHTML: () => cleanHTML(),
      setHTML: html => { content.innerHTML = html; updateStatus(); },
      getText: () => cleanText(),
      getFullHTML: getFullHTML,
      getJSON: () => ({ html:cleanHTML(), text:cleanText(), wordCount:(cleanText().trim()?cleanText().trim().split(/\s+/).length:0), charCount:cleanText().length, createdAt:new Date().toISOString() }),
      getMarkdown: () => htmlToMarkdown(content.innerHTML),
      setMarkdown: md => { content.innerHTML = markdownToHtml(md); updateStatus(); },
      saveHTML: filename => { const b=new Blob([getFullHTML()],{type:"text/html"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename||getFilename(".html"); a.click(); URL.revokeObjectURL(a.href); },
      saveText: filename => { const b=new Blob([cleanText()],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename||getFilename(".txt"); a.click(); URL.revokeObjectURL(a.href); },
      copyHTML: () => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write) return navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]); return navigator.clipboard.writeText(h); },
      copyText: () => navigator.clipboard.writeText(cleanText()),
      email: () => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write) return navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]); return navigator.clipboard.writeText(t); },
      print: () => { const w=window.open("","_blank"); w.document.write(getFullHTML()); w.document.close(); w.print(); },
      toggleSource: () => toggleSourceView(),
      toggleFullscreen: () => toggleFullscreen(),
      toggleMarkdown: () => toggleMarkdown(),
      toggleFocusMode: () => toggleFocusMode(),
      toggleGridlines: () => toggleGridlines(),
      toggleFindBar: () => toggleFindBar(),
      insertFootnote: () => insertFootnote(),
      insertTOC: () => insertTOC(),
      saveVersion: label => saveVersion(label),
      getVersions: () => versions.slice(),
      restoreVersion: idx => { if (versions[idx]) { content.innerHTML = versions[idx].html; updateStatus(); } },
      getReadability: () => {
        const text=content.innerText||""; const words=text.trim()?text.trim().split(/\s+/):[]; const sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
        const syl=words.reduce((s,w)=>s+countSyllables(w),0); const wc=words.length,sc=Math.max(sentences.length,1);
        return { fleschReadingEase:parseFloat((206.835-1.015*(wc/sc)-84.6*(syl/Math.max(wc,1))).toFixed(1)), gradeLevel:parseFloat((0.39*(wc/sc)+11.8*(syl/Math.max(wc,1))-15.59).toFixed(1)), wordCount:wc, sentenceCount:sc, syllableCount:syl };
      },
      getSEOIssues: () => { const issues=[]; const h1s=content.querySelectorAll("h1"); if(!h1s.length)issues.push("No H1"); if(h1s.length>1)issues.push("Multiple H1s"); Array.from(content.querySelectorAll("img")).filter(i=>!i.alt||i.alt==="image").forEach(()=>issues.push("Image missing alt text")); if((content.innerText.trim()?content.innerText.trim().split(/\s+/).length:0)<300)issues.push("Content too short"); return issues; },
      getAccessibilityIssues: () => { const issues=[]; content.querySelectorAll("img").forEach(i=>{if(!i.alt||i.alt==="image")issues.push("Image missing alt text");}); content.querySelectorAll("a").forEach(a=>{const t=a.textContent.trim().toLowerCase();if(["click here","here","link","read more"].includes(t))issues.push("Non-descriptive link: "+t);}); return issues; },
      ai: {
        run: async (prompt, text) => { if(!options.apiKey&&!options.aiProxy)throw new Error("No API key"); const provider=AI_PROVIDERS[options.aiProvider]||AI_PROVIDERS.anthropic; const url=(provider.urlNonStream||provider.url)(options); const bodyObj=provider.body(options,null,prompt+"\n\n"+(text||content.innerText),false); if(options.aiProxy)bodyObj._provider=options.aiProvider||"anthropic"; const resp=await fetch(url,{method:"POST",headers:provider.headers(options),body:JSON.stringify(bodyObj)}); if(!resp.ok)throw new Error("API error: "+resp.status); const data=await resp.json(); return provider.extractResponseText(data); },
        cancel: () => { if (aiAbortController) aiAbortController.abort(); }
      },
      onChange: null,
      setAiAutocomplete: (enabled) => { options.aiAutocomplete = enabled; if (!enabled) dismissGhost(); },
      focus: () => content.focus(),
      destroy: () => { clearImageResize(); if(autosaveTimer)clearInterval(autosaveTimer); wrap.remove(); },
      element: content,
      wrapper: wrap,
    };
    return api;
  }

  return { init };
});
      element: content,
      wrapper: wrap,
    };
    return api;
  }

  return { init };
});

    // ── Image Resize ──
    let resizeOverlay = null, resizeImg = null, resizeDragging = false, resizeStartX = 0, resizeStartWidth = 0;
    function clearImageResize() { if (resizeOverlay) { resizeOverlay.remove(); resizeOverlay = null; } if (resizeImg) { resizeImg.classList.remove("rte-img-resizing"); resizeImg = null; } resizeDragging = false; }
    function positionOverlay() { if (!resizeOverlay || !resizeImg) return; const ir = resizeImg.getBoundingClientRect(), wr = wrap.getBoundingClientRect(); resizeOverlay.style.top=(ir.top-wr.top)+"px"; resizeOverlay.style.left=(ir.left-wr.left)+"px"; resizeOverlay.style.width=ir.width+"px"; resizeOverlay.style.height=ir.height+"px"; }
    function selectImageForResize(img) {
      clearImageResize(); resizeImg = img; img.classList.add("rte-img-resizing");
      resizeOverlay = document.createElement("div"); resizeOverlay.className = "rte-img-resize-overlay";
      ["nw","ne","sw","se"].forEach(pos => { const h = document.createElement("div"); h.className = "rte-img-resize-handle "+pos; h.addEventListener("mousedown", e => { e.preventDefault(); e.stopPropagation(); resizeDragging = true; resizeStartX = e.clientX; resizeStartWidth = resizeImg.getBoundingClientRect().width; }); resizeOverlay.appendChild(h); });
      wrap.appendChild(resizeOverlay); positionOverlay();
    }
    content.addEventListener("click", e => {
      if (e.target.tagName === "IMG") { e.preventDefault(); selectImageForResize(e.target); }
      // Checklist toggle: click on <li> inside .rte-checklist toggles checked
      const checkLi = e.target.closest("ul.rte-checklist > li");
      if (checkLi) {
        // Only toggle if clicking the li itself or the checkbox area (left side)
        const liRect = checkLi.getBoundingClientRect();
        if (e.clientX < liRect.left + 30) {
          e.preventDefault();
          checkLi.classList.toggle("checked");
          updateStatus();
        }
      }
    });
    document.addEventListener("mousemove", e => { if (!resizeDragging || !resizeImg) return; const nw = Math.max(20, resizeStartWidth + (e.clientX - resizeStartX)); resizeImg.style.width = nw+"px"; resizeImg.style.height = "auto"; positionOverlay(); });
    document.addEventListener("mouseup", () => { if (resizeDragging) { resizeDragging = false; updateStatus(); } });
    content.addEventListener("scroll", positionOverlay); content.addEventListener("input", positionOverlay);
    document.addEventListener("keydown", e => { if (!resizeImg) return; if (e.key === "Escape") clearImageResize(); else if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); resizeImg.remove(); clearImageResize(); updateStatus(); } });

    updateStatus();

    // ── Table Resize System ─────────────────────────────────
    let tableResizing = false;
    let tableResizeType = null; // "col" or "row"
    let tableResizeStart = 0;
    let tableResizeCell = null;
    let tableResizeStartSize = 0;
    let tableResizeColIndex = -1;
    let tableResizeTable = null;

    const TABLE_BORDER_THRESHOLD = 4;

    function getTableBorderHit(e) {
      const target = e.target.closest ? e.target.closest("td, th") : null;
      if (!target) return null;
      const rect = target.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      // Check right edge for column resize
      if (Math.abs(x - rect.right) <= TABLE_BORDER_THRESHOLD) {
        return { type: "col", cell: target };
      }
      // Check left edge (resize previous column)
      if (Math.abs(x - rect.left) <= TABLE_BORDER_THRESHOLD) {
        const row = target.parentElement;
        const idx = Array.from(row.children).indexOf(target);
        if (idx > 0) {
          return { type: "col", cell: row.children[idx - 1] };
        }
        return null;
      }
      // Check bottom edge for row resize
      if (Math.abs(y - rect.bottom) <= TABLE_BORDER_THRESHOLD) {
        return { type: "row", cell: target };
      }
      // Check top edge (resize previous row)
      if (Math.abs(y - rect.top) <= TABLE_BORDER_THRESHOLD) {
        const row = target.parentElement;
        const prevRow = row.previousElementSibling;
        if (prevRow) {
          const idx = Array.from(row.children).indexOf(target);
          const prevCell = prevRow.children[idx] || prevRow.lastElementChild;
          if (prevCell) return { type: "row", cell: prevCell };
        }
        return null;
      }
      return null;
    }

    content.addEventListener("mousemove", (e) => {
      if (tableResizing) return;
      const hit = getTableBorderHit(e);
      content.classList.remove("rte-col-resize", "rte-row-resize");
      if (hit) {
        content.classList.add(hit.type === "col" ? "rte-col-resize" : "rte-row-resize");
      }
    });

    content.addEventListener("mousedown", (e) => {
      const hit = getTableBorderHit(e);
      if (!hit) return;
      e.preventDefault();
      e.stopPropagation();

      tableResizing = true;
      tableResizeType = hit.type;
      tableResizeCell = hit.cell;
      tableResizeTable = hit.cell.closest("table");

      if (hit.type === "col") {
        tableResizeStart = e.clientX;
        tableResizeStartSize = hit.cell.getBoundingClientRect().width;
        tableResizeColIndex = Array.from(hit.cell.parentElement.children).indexOf(hit.cell);
      } else {
        tableResizeStart = e.clientY;
        tableResizeStartSize = hit.cell.getBoundingClientRect().height;
      }

      content.classList.add("rte-table-resizing");
      content.classList.add(hit.type === "col" ? "rte-col-resize" : "rte-row-resize");
    });

    document.addEventListener("mousemove", (e) => {
      if (!tableResizing) return;

      if (tableResizeType === "col") {
        const delta = e.clientX - tableResizeStart;
        const newWidth = Math.max(30, tableResizeStartSize + delta);
        // Set table to fixed layout on first resize
        if (tableResizeTable.style.tableLayout !== "fixed") {
          // Snapshot all column widths before switching to fixed layout
          const firstRow = tableResizeTable.querySelector("tr");
          if (firstRow) {
            Array.from(firstRow.children).forEach((cell) => {
              cell.style.width = cell.getBoundingClientRect().width + "px";
            });
          }
          tableResizeTable.style.tableLayout = "fixed";
        }
        // Apply width to all cells in the same column
        const rows = tableResizeTable.querySelectorAll("tr");
        rows.forEach((row) => {
          const cell = row.children[tableResizeColIndex];
          if (cell) cell.style.width = newWidth + "px";
        });
        // Update table width to sum of columns
        const firstRow = tableResizeTable.querySelector("tr");
        if (firstRow) {
          let totalWidth = 0;
          Array.from(firstRow.children).forEach((cell) => {
            totalWidth += cell.getBoundingClientRect().width;
          });
          tableResizeTable.style.width = totalWidth + "px";
        }
      } else {
        const delta = e.clientY - tableResizeStart;
        const newHeight = Math.max(20, tableResizeStartSize + delta);
        // Apply height to all cells in the same row
        const row = tableResizeCell.parentElement;
        Array.from(row.children).forEach((cell) => {
          cell.style.height = newHeight + "px";
        });
      }
    });

    document.addEventListener("mouseup", () => {
      if (tableResizing) {
        tableResizing = false;
        tableResizeCell = null;
        tableResizeTable = null;
        content.classList.remove("rte-table-resizing", "rte-col-resize", "rte-row-resize");
        updateStatus();
      }
    });

    // ── Column layout resize ──
    let _colResizing = false, _colHandle = null, _colGrid = null, _colStartX = 0, _colWidths = [];
    content.addEventListener("mousedown", e => {
      const handle = e.target.closest(".rte-pro-col-handle");
      if (!handle) return;
      e.preventDefault(); e.stopPropagation();
      _colResizing = true; _colHandle = handle; _colGrid = handle.closest(".rte-pro-cols");
      handle.classList.add("active");
      _colStartX = e.clientX;
      const cols = Array.from(_colGrid.querySelectorAll(".rte-pro-col"));
      _colWidths = cols.map(c => c.getBoundingClientRect().width);
      const kids = Array.from(_colGrid.children);
      const hIdx = kids.indexOf(handle);
      _colHandle._leftIdx = kids.slice(0, hIdx).filter(k => k.classList.contains("rte-pro-col")).length - 1;
      _colHandle._rightIdx = _colHandle._leftIdx + 1;
    });
    document.addEventListener("mousemove", e => {
      if (!_colResizing) return;
      const delta = e.clientX - _colStartX;
      const li = _colHandle._leftIdx, ri = _colHandle._rightIdx;
      const newLeft = Math.max(60, _colWidths[li] + delta);
      const newRight = Math.max(60, _colWidths[ri] - delta);
      const widths = [..._colWidths];
      widths[li] = newLeft; widths[ri] = newRight;
      const parts = [];
      widths.forEach((w, i) => { if (i > 0) parts.push("6px"); parts.push(w + "px"); });
      _colGrid.style.gridTemplateColumns = parts.join(" ");
    });
    document.addEventListener("mouseup", () => {
      if (!_colResizing) return;
      _colResizing = false;
      if (_colHandle) _colHandle.classList.remove("active");
      _colHandle = null; _colGrid = null;
      updateStatus();
    });

    // ── Public API ──
    const api = {
      getHTML: () => cleanHTML(),
      setHTML: html => { content.innerHTML = html; updateStatus(); },
      getText: () => cleanText(),
      getFullHTML: getFullHTML,
      getJSON: () => ({ html:cleanHTML(), text:cleanText(), wordCount:(cleanText().trim()?cleanText().trim().split(/\s+/).length:0), charCount:cleanText().length, createdAt:new Date().toISOString() }),
      getMarkdown: () => htmlToMarkdown(content.innerHTML),
      setMarkdown: md => { content.innerHTML = markdownToHtml(md); updateStatus(); },
      saveHTML: filename => { const b=new Blob([getFullHTML()],{type:"text/html"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename||getFilename(".html"); a.click(); URL.revokeObjectURL(a.href); },
      saveText: filename => { const b=new Blob([cleanText()],{type:"text/plain"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download=filename||getFilename(".txt"); a.click(); URL.revokeObjectURL(a.href); },
      copyHTML: () => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write) return navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]); return navigator.clipboard.writeText(h); },
      copyText: () => navigator.clipboard.writeText(cleanText()),
      email: () => { const h=cleanHTML(),t=cleanText(); if(navigator.clipboard&&navigator.clipboard.write) return navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([h],{type:"text/html"}),"text/plain":new Blob([t],{type:"text/plain"})})]); return navigator.clipboard.writeText(t); },
      print: () => { const w=window.open("","_blank"); w.document.write(getFullHTML()); w.document.close(); w.print(); },
      toggleSource: () => toggleSourceView(),
      toggleFullscreen: () => toggleFullscreen(),
      toggleMarkdown: () => toggleMarkdown(),
      toggleFocusMode: () => toggleFocusMode(),
      toggleGridlines: () => toggleGridlines(),
      toggleFindBar: () => toggleFindBar(),
      insertFootnote: () => insertFootnote(),
      insertTOC: () => insertTOC(),
      saveVersion: label => saveVersion(label),
      getVersions: () => versions.slice(),
      restoreVersion: idx => { if (versions[idx]) { content.innerHTML = versions[idx].html; updateStatus(); } },
      getReadability: () => {
        const text=content.innerText||""; const words=text.trim()?text.trim().split(/\s+/):[]; const sentences=text.split(/[.!?]+/).filter(s=>s.trim().length>0);
        const syl=words.reduce((s,w)=>s+countSyllables(w),0); const wc=words.length,sc=Math.max(sentences.length,1);
        return { fleschReadingEase:parseFloat((206.835-1.015*(wc/sc)-84.6*(syl/Math.max(wc,1))).toFixed(1)), gradeLevel:parseFloat((0.39*(wc/sc)+11.8*(syl/Math.max(wc,1))-15.59).toFixed(1)), wordCount:wc, sentenceCount:sc, syllableCount:syl };
      },
      getSEOIssues: () => { const issues=[]; const h1s=content.querySelectorAll("h1"); if(!h1s.length)issues.push("No H1"); if(h1s.length>1)issues.push("Multiple H1s"); Array.from(content.querySelectorAll("img")).filter(i=>!i.alt||i.alt==="image").forEach(()=>issues.push("Image missing alt text")); if((content.innerText.trim()?content.innerText.trim().split(/\s+/).length:0)<300)issues.push("Content too short"); return issues; },
      getAccessibilityIssues: () => { const issues=[]; content.querySelectorAll("img").forEach(i=>{if(!i.alt||i.alt==="image")issues.push("Image missing alt text");}); content.querySelectorAll("a").forEach(a=>{const t=a.textContent.trim().toLowerCase();if(["click here","here","link","read more"].includes(t))issues.push("Non-descriptive link: "+t);}); return issues; },
      ai: {
        run: async (prompt, text) => { if(!options.apiKey&&!options.aiProxy)throw new Error("No API key"); const provider=AI_PROVIDERS[options.aiProvider]||AI_PROVIDERS.anthropic; const url=(provider.urlNonStream||provider.url)(options); const bodyObj=provider.body(options,null,prompt+"\n\n"+(text||content.innerText),false); if(options.aiProxy)bodyObj._provider=options.aiProvider||"anthropic"; const resp=await fetch(url,{method:"POST",headers:provider.headers(options),body:JSON.stringify(bodyObj)}); if(!resp.ok)throw new Error("API error: "+resp.status); const data=await resp.json(); return provider.extractResponseText(data); },
        cancel: () => { if (aiAbortController) aiAbortController.abort(); }
      },
      onChange: null,
      setAiAutocomplete: (enabled) => { options.aiAutocomplete = enabled; if (!enabled) dismissGhost(); },
      focus: () => content.focus(),
      destroy: () => { clearImageResize(); if(autosaveTimer)clearInterval(autosaveTimer); wrap.remove(); },
      element: content,
      wrapper: wrap,
    };
    return api;
  }

  return { init };
});

/**
 * RTEProWS — WebSocket Connector for RTEPro Rich Text Editor
 * Bundled companion. Works with any WebSocket backend.
 *
 * Usage:
 *   <script src="rte-pro-ws.js"></script>
 *   <script>
 *     const editor = RTEPro.init('#editor', { ... });
 *     const ws = RTEProWS.connect(editor, 'wss://yourserver.com/ws', {
 *       docId: 'doc-123',
 *       userId: 'user-abc',
 *     });
 *   </script>
 */
/**
 * RTE-WS — WebSocket Connector for RTE Rich Text Editor
 * Standalone companion file. Works with any WebSocket backend.
 *
 * Features:
 *   - Auto-save: debounced content sync to backend on changes
 *   - Real-time collaboration: broadcast and receive changes between users
 *   - Auto-reconnect with exponential backoff
 *   - Heartbeat / keep-alive ping
 *
 * Usage:
 *   <script>
 *       docId: 'doc-123',
 *       userId: 'user-abc',
 *     });
 *   </script>
 *
 * Backend messages (JSON):
 *   Incoming:
 *     { type: "load",    html: "<p>...</p>" }           — load initial content
 *     { type: "update",  html: "<p>...</p>", userId: "..." } — remote user change
 *     { type: "cursor",  userId: "...", position: {...} } — remote cursor (optional)
 *     { type: "saved",   version: 5 }                   — server confirmed save
 *     { type: "error",   message: "..." }                — server error
 *
 *   Outgoing:
 *     { type: "join",    docId, userId }                 — join document
 *     { type: "change",  docId, userId, html, text, words, chars } — content changed
 *     { type: "save",    docId, userId, html, text, words, chars } — explicit save
 *     { type: "ping" }                                   — heartbeat
 */
(function (root, factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.RTEProWS = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const DEFAULTS = {
    docId: null,
    userId: null,
    debounceMs: 1000,
    reconnect: true,
    reconnectMaxMs: 30000,
    reconnectBaseMs: 1000,
    heartbeatMs: 30000,
    autoSave: true,
    onOpen: null,
    onClose: null,
    onError: null,
    onSaved: null,
    onRemoteUpdate: null,
    onMessage: null,
  };

  function connect(editor, url, opts) {
    const cfg = Object.assign({}, DEFAULTS, opts);
    let ws = null;
    let reconnectAttempts = 0;
    let reconnectTimer = null;
    let heartbeatTimer = null;
    let debounceTimer = null;
    let isSending = false;
    let destroyed = false;
    let lastSentHTML = "";

    // ── WebSocket lifecycle ──────────────────────────────

    function open() {
      if (destroyed) return;
      ws = new WebSocket(url);

      ws.onopen = function () {
        reconnectAttempts = 0;
        // Join document
        send({ type: "join", docId: cfg.docId, userId: cfg.userId });
        // Start heartbeat
        startHeartbeat();
        if (cfg.onOpen) cfg.onOpen(ws);
      };

      ws.onmessage = function (e) {
        let msg;
        try {
          msg = JSON.parse(e.data);
        } catch (_) {
          return;
        }
        handleMessage(msg);
      };

      ws.onclose = function (e) {
        stopHeartbeat();
        if (cfg.onClose) cfg.onClose(e);
        if (cfg.reconnect && !destroyed) scheduleReconnect();
      };

      ws.onerror = function (e) {
        if (cfg.onError) cfg.onError(e);
      };
    }

    function send(data) {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
        return true;
      }
      return false;
    }

    // ── Incoming messages ────────────────────────────────

    function handleMessage(msg) {
      switch (msg.type) {
        case "load":
          if (msg.html != null) {
            editor.setHTML(msg.html);
            lastSentHTML = msg.html;
          }
          break;

        case "update":
          // Remote user change — only apply if from a different user
          if (msg.userId !== cfg.userId && msg.html != null) {
            // Save cursor position
            const sel = window.getSelection();
            const hadFocus = document.activeElement === editor.element;
            let savedOffset = null;
            if (hadFocus && sel.rangeCount) {
              const range = sel.getRangeAt(0);
              savedOffset = {
                startContainer: range.startContainer,
                startOffset: range.startOffset,
                endContainer: range.endContainer,
                endOffset: range.endOffset,
              };
            }
            isSending = true;
            editor.setHTML(msg.html);
            lastSentHTML = msg.html;
            isSending = false;
            // Restore cursor
            if (hadFocus && savedOffset) {
              try {
                const r = document.createRange();
                r.setStart(savedOffset.startContainer, savedOffset.startOffset);
                r.setEnd(savedOffset.endContainer, savedOffset.endOffset);
                sel.removeAllRanges();
                sel.addRange(r);
              } catch (_) {
                // Node may no longer exist after HTML replacement
              }
            }
            if (cfg.onRemoteUpdate) cfg.onRemoteUpdate(msg);
          }
          break;

        case "saved":
          if (cfg.onSaved) cfg.onSaved(msg);
          break;

        case "error":
          if (cfg.onError) cfg.onError(new Error(msg.message));
          break;
      }

      if (cfg.onMessage) cfg.onMessage(msg);
    }

    // ── Auto-save on change ──────────────────────────────

    function onEditorChange(data) {
      if (isSending || !cfg.autoSave) return;
      const html = editor.getHTML();
      if (html === lastSentHTML) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        lastSentHTML = html;
        send({
          type: "change",
          docId: cfg.docId,
          userId: cfg.userId,
          html: html,
          text: data.text,
          words: data.words,
          chars: data.chars,
        });
      }, cfg.debounceMs);
    }

    // Hook into editor onChange
    const origOnChange = editor.onChange;
    editor.onChange = function (data) {
      if (origOnChange) origOnChange(data);
      onEditorChange(data);
    };

    // ── Reconnect ────────────────────────────────────────

    function scheduleReconnect() {
      if (destroyed) return;
      reconnectAttempts++;
      const delay = Math.min(
        cfg.reconnectBaseMs * Math.pow(2, reconnectAttempts - 1),
        cfg.reconnectMaxMs
      );
      reconnectTimer = setTimeout(open, delay);
    }

    // ── Heartbeat ────────────────────────────────────────

    function startHeartbeat() {
      stopHeartbeat();
      if (cfg.heartbeatMs > 0) {
        heartbeatTimer = setInterval(function () {
          send({ type: "ping" });
        }, cfg.heartbeatMs);
      }
    }

    function stopHeartbeat() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }

    // ── Public API ───────────────────────────────────────

    open();

    return {
      /** Send an explicit save request */
      save: function () {
        const html = editor.getHTML();
        const text = editor.getText();
        lastSentHTML = html;
        return send({
          type: "save",
          docId: cfg.docId,
          userId: cfg.userId,
          html: html,
          text: text,
          words: text.split(/\s+/).filter(Boolean).length,
          chars: text.length,
        });
      },

      /** Send a custom message */
      send: send,

      /** Disconnect and stop reconnecting */
      disconnect: function () {
        destroyed = true;
        clearTimeout(reconnectTimer);
        clearTimeout(debounceTimer);
        stopHeartbeat();
        if (ws) ws.close();
      },

      /** Reconnect manually */
      reconnect: function () {
        destroyed = false;
        if (ws) ws.close();
        open();
      },

      /** Get connection state: "connecting" | "open" | "closing" | "closed" */
      get state() {
        if (!ws) return "closed";
        return ["connecting", "open", "closing", "closed"][ws.readyState];
      },

      /** The raw WebSocket instance */
      get socket() {
        return ws;
      },
    };
  }

  return { connect: connect };
});
