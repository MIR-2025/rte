(function (root, factory) {
  "use strict";
  /* ═══════════════════════════════════════════════════════════
     RTE — Rich Text Editor  •  Single-file embeddable editor
     UMD: works as <script>, CommonJS (require), or ESM (import)
     ═══════════════════════════════════════════════════════════ */
  if (typeof define === "function" && define.amd) {
    // AMD (RequireJS)
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // CommonJS / Node
    module.exports = factory();
  } else {
    // Browser global
    root.RTE = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ── Inject Styles ────────────────────────────────────────
  const CSS = `
/* RTE Embedded Styles */
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

/* Toolbar */
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
.rte-toolbar .rte-sep {
  width: 1px;
  height: 26px;
  background: var(--rte-border);
  margin: 0 4px;
  flex-shrink: 0;
}

/* Buttons */
.rte-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
  padding: 0 5px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background .15s, transform .1s;
  position: relative;
  color: #334155;
}
.rte-btn:hover { background: var(--rte-hover); transform: scale(1.08); z-index: 10; }
.rte-btn:active { background: var(--rte-active); transform: scale(.96); }
.rte-btn.active {
  background: var(--rte-accent);
  color: #fff;
  transform: scale(.96);
  box-shadow: 0 1px 4px rgba(99,102,241,.35);
}

/* SVG icon buttons */
.rte-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-width: 2;
  stroke-linecap: round;
}
.rte-btn.active svg { stroke: #fff; }

/* Styled text format buttons (B, I, U, S, etc.) */
.rte-btn-text {
  font-size: 15px;
  font-weight: 700;
  font-family: Georgia, "Times New Roman", serif;
  min-width: 30px;
}
.rte-btn-text.fmt-bold { font-weight: 900; }
.rte-btn-text.fmt-italic { font-style: italic; }
.rte-btn-text.fmt-underline { text-decoration: underline; text-underline-offset: 2px; }
.rte-btn-text.fmt-strike { text-decoration: line-through; }
.rte-btn-text.fmt-sub { font-size: 13px; }
.rte-btn-text.fmt-sup { font-size: 13px; }

/* Tooltips — works on .rte-btn AND .rte-tip wrappers */
/* Shown BELOW the button so they stay inside the editor viewport */
.rte-btn[data-tip]::after,
.rte-tip[data-tip]::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%) scale(.9);
  background: #1e293b;
  color: #fff;
  font-size: 11px;
  font-weight: 400;
  font-style: normal;
  text-decoration: none;
  padding: 4px 10px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .18s, transform .18s;
  z-index: 10000;
  font-family: var(--rte-font);
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}
.rte-btn:hover[data-tip]::after,
.rte-tip:hover[data-tip]::after { opacity: 1; transform: translateX(-50%) scale(1); }
.rte-tip {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.rte-tip:hover { z-index: 10; }

/* Select */
.rte-select {
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--rte-border);
  border-radius: 6px;
  background: var(--rte-bg);
  font-family: var(--rte-font);
  font-size: 13px;
  cursor: pointer;
  outline: none;
}
.rte-select:hover { border-color: #94a3b8; }

/* Color picker wrapper */
.rte-color-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.rte-color-wrap input[type="color"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  padding: 0;
}

/* Editor area */
.rte-content {
  min-height: 260px;
  overflow: auto;
  resize: vertical;
  padding: 16px 20px;
  outline: none;
  font-size: 15px;
  line-height: 1.7;
  color: #1e293b;
  caret-color: var(--rte-accent);
}
.rte-content:empty::before {
  content: attr(data-placeholder);
  color: #94a3b8;
  pointer-events: none;
  display: block;
}
.rte-content h1 { font-size: 2em; margin: .4em 0; }
.rte-content h2 { font-size: 1.5em; margin: .35em 0; }
.rte-content h3 { font-size: 1.25em; margin: .3em 0; }
.rte-content h4 { font-size: 1.1em; margin: .25em 0; }
.rte-content p { margin: .3em 0; }
.rte-content blockquote {
  border-left: 4px solid var(--rte-accent);
  margin: .6em 0;
  padding: .4em .8em;
  background: #f1f5f9;
  border-radius: 0 6px 6px 0;
}
.rte-content pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: "Fira Code", Consolas, monospace;
  font-size: 13px;
}
.rte-content img, .rte-content video, .rte-content audio {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
  display: block;
}
.rte-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 8px 0;
}
.rte-content table td, .rte-content table th {
  border: 1px solid var(--rte-border);
  padding: 8px 12px;
  text-align: left;
  min-width: 60px;
}
.rte-content table th {
  background: var(--rte-toolbar-bg);
  font-weight: 600;
}
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

/* Popup panels */
.rte-popup {
  position: absolute;
  z-index: 50;
  background: var(--rte-bg);
  border: 1px solid var(--rte-border);
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(0,0,0,.13);
  padding: 12px 14px;
  display: none;
  min-width: 220px;
}
.rte-popup.show { display: block; animation: rtePopIn .2s ease; }
@keyframes rtePopIn {
  from { opacity: 0; transform: translateY(6px) scale(.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
.rte-popup label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 4px; }
.rte-popup input[type="text"], .rte-popup input[type="url"] {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--rte-border);
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--rte-font);
  outline: none;
  margin-bottom: 8px;
}
.rte-popup input:focus { border-color: var(--rte-accent); box-shadow: 0 0 0 2px rgba(99,102,241,.18); }
.rte-popup-actions { display: flex; gap: 6px; justify-content: flex-end; }
.rte-popup-btn {
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-family: var(--rte-font);
  cursor: pointer;
  font-weight: 500;
}
.rte-popup-btn.primary { background: var(--rte-accent); color: #fff; }
.rte-popup-btn.primary:hover { background: #4f46e5; }
.rte-popup-btn.secondary { background: #e2e8f0; color: #334155; }
.rte-popup-btn.secondary:hover { background: #cbd5e1; }

/* Color swatches */
.rte-swatches { display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-top: 6px; }
.rte-swatch {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform .12s, border-color .12s;
}
.rte-swatch:hover { transform: scale(1.22); border-color: var(--rte-accent); }
.rte-swatch.active-swatch { border-color: var(--rte-accent); transform: scale(1.15); }

/* Emoji picker grid */
.rte-emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 6px;
}
.rte-emoji-item {
  width: 32px; height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: none;
  background: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background .12s, transform .12s;
}
.rte-emoji-item:hover { background: var(--rte-hover); transform: scale(1.15); }

/* Table popup grid selector */
.rte-table-grid {
  display: grid;
  grid-template-columns: repeat(6, 24px);
  gap: 3px;
  margin-top: 6px;
}
.rte-table-cell {
  width: 24px; height: 24px;
  border: 1px solid var(--rte-border);
  border-radius: 3px;
  cursor: pointer;
  transition: background .1s;
}
.rte-table-cell:hover, .rte-table-cell.highlight { background: #c7d2fe; border-color: var(--rte-accent); }
.rte-table-size { font-size: 12px; color: #64748b; margin-top: 4px; text-align: center; }

/* Export bar */
.rte-exportbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px 8px;
  background: var(--rte-toolbar-bg);
  border-top: 1px solid var(--rte-border);
  align-items: center;
  user-select: none;
}
.rte-export-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1px solid var(--rte-border);
  border-radius: 6px;
  background: var(--rte-bg);
  font-family: var(--rte-font);
  font-size: 12px;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .1s;
  white-space: nowrap;
}
.rte-export-btn:hover { background: var(--rte-hover); border-color: #94a3b8; transform: scale(1.03); }
.rte-export-btn:active { transform: scale(.97); }
.rte-export-btn .rte-export-icon { font-size: 14px; }
.rte-filename-input { padding: 4px 8px; border: 1px solid var(--rte-border); border-radius: 6px; font-family: var(--rte-font); font-size: 12px; color: #334155; background: var(--rte-bg); width: 150px; outline: none; margin-right: 2px; }
.rte-filename-input:focus { border-color: #60a5fa; box-shadow: 0 0 0 2px rgba(96,165,250,0.2); }
.rte-filename-input::placeholder { color: #94a3b8; }
.rte-toast {
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%) translateY(8px);
  background: #1e293b;
  color: #fff;
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--rte-font);
  pointer-events: none;
  opacity: 0;
  transition: opacity .2s, transform .2s;
  z-index: 60;
  white-space: nowrap;
}
.rte-toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* Status bar */
.rte-statusbar {
  display: flex;
  justify-content: space-between;
  padding: 4px 12px;
  font-size: 11px;
  color: #94a3b8;
  background: var(--rte-toolbar-bg);
  border-top: 1px solid var(--rte-border);
}

/* Hidden file inputs */
.rte-wrap input[type="file"] { display: none; }

/* Image resize overlay */
.rte-img-resize-overlay {
  position: absolute;
  border: 2px solid #3b82f6;
  pointer-events: none;
  z-index: 10;
}
.rte-img-resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border: 1px solid #fff;
  border-radius: 2px;
  pointer-events: auto;
  z-index: 11;
}
.rte-img-resize-handle.nw { top: -5px; left: -5px; cursor: nw-resize; }
.rte-img-resize-handle.ne { top: -5px; right: -5px; cursor: ne-resize; }
.rte-img-resize-handle.sw { bottom: -5px; left: -5px; cursor: sw-resize; }
.rte-img-resize-handle.se { bottom: -5px; right: -5px; cursor: se-resize; }
.rte-img-resizing {
  outline: 2px solid #3b82f6;
  outline-offset: 1px;
}

/* Responsive */
@media (max-width: 580px) {
  .rte-btn { min-width: 28px; height: 28px; font-size: 16px; }
  .rte-btn-text { font-size: 13px; }
  .rte-content { padding: 12px 14px; font-size: 14px; }
}
`;

  function injectCSS() {
    if (document.getElementById("rte-styles")) return;
    const s = document.createElement("style");
    s.id = "rte-styles";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  // ── Color Palette ────────────────────────────────────────
  const COLORS = [
    "#000000","#434343","#666666","#999999","#b7b7b7","#cccccc","#d9d9d9","#ffffff",
    "#e06666","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79",
    "#cc0000","#e69138","#f1c232","#38761d","#134f5c","#0b5394","#351c75","#741b47",
    "#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff","#9900ff","#ff00ff",
    "#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc",
  ];

  // ── Emoji Collection ─────────────────────────────────────
  const EMOJIS = [
    "😀","😂","😍","🥰","😎","🤩","😇","🥳",
    "😢","😡","🤔","😱","🤗","😴","🤮","🥺",
    "👍","👎","👏","🙌","💪","🤝","✌️","🤞",
    "❤️","🧡","💛","💚","💙","💜","🖤","🤍",
    "⭐","🌟","✨","💫","🔥","💯","🎉","🎊",
    "✅","❌","⚠️","💡","🎯","🏆","🎁","📌",
    "🚀","🌈","☀️","🌙","🌎","🍕","🎵","📷",
  ];

  // ── Font Families ────────────────────────────────────────
  const FONTS = [
    ["Default", ""],
    ["Arial", "Arial, sans-serif"],
    ["Georgia", "Georgia, serif"],
    ["Times New Roman", "'Times New Roman', serif"],
    ["Courier New", "'Courier New', monospace"],
    ["Verdana", "Verdana, sans-serif"],
    ["Trebuchet MS", "'Trebuchet MS', sans-serif"],
    ["Comic Sans MS", "'Comic Sans MS', cursive"],
    ["Impact", "Impact, sans-serif"],
  ];

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
    return el("button", { type: "button", className: "rte-btn" + (extraClass ? " " + extraClass : ""), "data-tip": tip, onClick }, emoji);
  }

  function fmtBtn(label, tip, onClick, fmtClass) {
    return el("button", {
      type: "button",
      className: "rte-btn rte-btn-text " + fmtClass,
      "data-tip": tip,
      onClick
    }, label);
  }

  function sep() {
    return el("span", { className: "rte-sep" });
  }

  function tipWrap(child, tip) {
    const w = el("span", { className: "rte-tip", "data-tip": tip });
    w.appendChild(child);
    return w;
  }

  // ── Alignment SVG Icons (traditional line-based) ──────────
  function alignIcon(type) {
    const lines = { left: [3,14,3,11,3,8], center: [5,13,3,15,5,13], right: [5,15,3,15,5,15], justify: [3,15,3,15,3,15] };
    const y = [4, 9, 14];
    const l = lines[type];
    return '<svg viewBox="0 0 18 18"><line x1="' + l[0] + '" y1="' + y[0] + '" x2="' + l[1] + '" y2="' + y[0] + '"/><line x1="' + l[2] + '" y1="' + y[1] + '" x2="' + l[3] + '" y2="' + y[1] + '"/><line x1="' + l[4] + '" y1="' + y[2] + '" x2="' + l[5] + '" y2="' + y[2] + '"/></svg>';
  }

  // ── Save / Restore Selection ─────────────────────────────
  function saveSelection() {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) return sel.getRangeAt(0).cloneRange();
    return null;
  }
  function restoreSelection(range) {
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  // ── Build Editor ─────────────────────────────────────────
  function init(selector, options) {
    injectCSS();
    const target = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!target) { console.error("RTE: target not found", selector); return null; }

    options = Object.assign({
      placeholder: "Start typing something amazing\u2026",
      height: null,
      exportCSS: null,
      exportTemplate: null,
    }, options);

    const wrap = el("div", { className: "rte-wrap" });
    const toolbar = el("div", { className: "rte-toolbar" });
    const content = el("div", {
      className: "rte-content",
      contenteditable: "true",
      "data-placeholder": options.placeholder,
    });
    if (options.height) content.style.minHeight = options.height;

    const statusbar = el("div", { className: "rte-statusbar" });
    const wordCount = el("span", { title: "Total word count" }, "Words: 0");
    const charCount = el("span", { title: "Total character count" }, "Chars: 0");
    statusbar.append(wordCount, charCount);

    // Collect toggle-able format buttons for active state tracking
    const formatButtons = {};

    // ── exec shortcut ──
    function exec(cmd, val) {
      content.focus();
      document.execCommand(cmd, false, val || null);
      updateStatus();
      updateActiveStates();
    }

    // ── Active state tracking ──
    function updateActiveStates() {
      const cmds = { bold: "bold", italic: "italic", underline: "underline", strikeThrough: "strike", superscript: "sup", subscript: "sub" };
      Object.entries(cmds).forEach(([cmd, key]) => {
        if (formatButtons[key]) {
          formatButtons[key].classList.toggle("active", document.queryCommandState(cmd));
        }
      });
    }

    // ── Heading select ──
    const headingSelect = el("select", { className: "rte-select", "aria-label": "Block format" });
    [
      ["\u00b6 Paragraph","p"],
      ["\ud83d\udccc H1 \u2014 Title","h1"],
      ["\ud83d\udccc H2 \u2014 Section","h2"],
      ["\ud83d\udccc H3 \u2014 Subsection","h3"],
      ["\ud83d\udccc H4 \u2014 Detail","h4"],
    ].forEach(([label, val]) => {
      const o = el("option", { value: val }, label);
      headingSelect.appendChild(o);
    });
    headingSelect.addEventListener("change", () => {
      const v = headingSelect.value;
      exec("formatBlock", "<" + v + ">");
    });

    // ── Font Family select ──
    const fontSelect = el("select", { className: "rte-select", "aria-label": "Font family" });
    FONTS.forEach(([label, val]) => {
      const o = el("option", { value: val }, label);
      if (val) o.style.fontFamily = val;
      fontSelect.appendChild(o);
    });
    fontSelect.addEventListener("change", () => {
      if (fontSelect.value) exec("fontName", fontSelect.value);
    });

    // ── Font Size select ──
    const sizeSelect = el("select", { className: "rte-select", "aria-label": "Font size" });
    [
      ["\ud83d\udd24 Size",""],
      ["1 Tiny","1"],
      ["2 Small","2"],
      ["3 Normal","3"],
      ["4 Medium","4"],
      ["5 Large","5"],
      ["6 Huge","6"],
      ["7 Max","7"],
    ].forEach(([label, val]) => {
      const o = el("option", { value: val }, label);
      sizeSelect.appendChild(o);
    });
    sizeSelect.addEventListener("change", () => {
      if (sizeSelect.value) exec("fontSize", sizeSelect.value);
    });

    // ── Color popup builder ──
    function buildColorPopup(title, onPick) {
      const popup = el("div", { className: "rte-popup" });
      popup.addEventListener("mousedown", e => { if (e.target.tagName !== "INPUT") e.preventDefault(); });
      popup.appendChild(el("label", {}, title));
      const grid = el("div", { className: "rte-swatches" });
      COLORS.forEach(c => {
        const sw = el("div", {
          className: "rte-swatch",
          title: c,
          style: { background: c, border: c === "#ffffff" ? "2px solid #d0d5dd" : "2px solid transparent" },
          onClick: () => { onPick(c); popup.classList.remove("show"); }
        });
        grid.appendChild(sw);
      });
      popup.appendChild(grid);

      const customRow = el("div", { style: { marginTop: "8px", display: "flex", gap: "6px", alignItems: "center" } });
      const customInput = el("input", { type: "text", placeholder: "#hex or color name", style: { flex: "1" } });
      const customBtn = el("button", { className: "rte-popup-btn primary", title: "Apply custom color", onClick: () => {
        if (customInput.value) { onPick(customInput.value); popup.classList.remove("show"); }
      }}, "Apply");
      customRow.append(customInput, customBtn);
      popup.appendChild(customRow);

      return popup;
    }

    let savedRange = null;
    const allPopups = [];

    // Text color popup
    const textColorPopup = buildColorPopup("\ud83c\udfa8 Text Color", (c) => {
      restoreSelection(savedRange);
      exec("foreColor", c);
    });
    allPopups.push(textColorPopup);

    // Highlight popup
    const bgColorPopup = buildColorPopup("\ud83d\udd8d\ufe0f Highlight Color", (c) => {
      restoreSelection(savedRange);
      exec("hiliteColor", c);
    });
    allPopups.push(bgColorPopup);

    // ── Link popup ──
    const linkPopup = el("div", { className: "rte-popup" });
    linkPopup.innerHTML = `
      <label>\ud83d\udd17 Insert Link</label>
      <input type="text" class="rte-link-text" placeholder="Link Text">
      <input type="url" class="rte-link-url" placeholder="https://example.com">
      <div class="rte-popup-actions">
        <button class="rte-popup-btn secondary rte-link-cancel">Cancel</button>
        <button class="rte-popup-btn primary rte-link-ok">Insert</button>
      </div>
    `;
    allPopups.push(linkPopup);

    // ── Media popups ──
    function buildMediaPopup(label, accept, embedFn) {
      const popup = el("div", { className: "rte-popup" });
      const urlLabel = el("label", {}, label + " \u2014 paste URL or upload file");
      const urlInput = el("input", { type: "url", placeholder: "https://..." });
      const fileInput = el("input", { type: "file", accept });
      const fileBtn = el("button", { className: "rte-popup-btn secondary", title: "Browse your computer for a file", onClick: () => fileInput.click() }, "\ud83d\udcc2 Choose File");
      const actions = el("div", { className: "rte-popup-actions" });
      const cancelBtn = el("button", { className: "rte-popup-btn secondary", title: "Cancel without inserting", onClick: () => popup.classList.remove("show") }, "Cancel");
      const okBtn = el("button", { className: "rte-popup-btn primary", title: "Insert from the URL above", onClick: () => {
        if (urlInput.value) {
          restoreSelection(savedRange);
          embedFn(urlInput.value);
          popup.classList.remove("show");
          urlInput.value = "";
        }
      }}, "Insert");

      fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          restoreSelection(savedRange);
          embedFn(reader.result);
          popup.classList.remove("show");
          urlInput.value = "";
        };
        reader.readAsDataURL(file);
      });

      actions.append(cancelBtn, okBtn);
      popup.append(urlLabel, urlInput, el("div", { style: { margin: "6px 0", display: "flex", gap: "6px" } }, [fileBtn]), actions);
      allPopups.push(popup);
      return popup;
    }

    const imagePopup = buildMediaPopup("\ud83d\uddbc\ufe0f Image", "image/*", (src) => {
      exec("insertHTML", '<img src="' + src + '" alt="image">');
    });

    const videoPopup = buildMediaPopup("\ud83c\udfac Video", "video/*", (src) => {
      exec("insertHTML", '<video src="' + src + '" controls></video>');
    });

    const audioPopup = buildMediaPopup("\ud83d\udd0a Audio", "audio/*", (src) => {
      exec("insertHTML", '<audio src="' + src + '" controls></audio>');
    });

    // ── Emoji popup ──
    const emojiPopup = el("div", { className: "rte-popup" });
    emojiPopup.appendChild(el("label", {}, "\ud83d\ude00 Insert Emoji"));
    const emojiGrid = el("div", { className: "rte-emoji-grid" });
    EMOJIS.forEach(em => {
      const item = el("button", {
        className: "rte-emoji-item",
        title: "Insert " + em,
        onClick: () => {
          restoreSelection(savedRange);
          exec("insertHTML", em);
          emojiPopup.classList.remove("show");
        }
      }, em);
      emojiGrid.appendChild(item);
    });
    emojiPopup.appendChild(emojiGrid);
    allPopups.push(emojiPopup);

    // ── Table popup ──
    const tablePopup = el("div", { className: "rte-popup" });
    tablePopup.appendChild(el("label", {}, "\ud83d\udcca Insert Table"));
    const tableGrid = el("div", { className: "rte-table-grid" });
    const tableSizeLabel = el("div", { className: "rte-table-size" }, "Select size");
    let tRows = 0, tCols = 0;
    const tableCells = [];

    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cell = el("div", {
          className: "rte-table-cell",
          title: (r + 1) + " \u00d7 " + (c + 1) + " table",
          onMouseenter: () => {
            tRows = r + 1; tCols = c + 1;
            tableSizeLabel.textContent = tRows + " \u00d7 " + tCols;
            tableCells.forEach(({ el: ce, r: cr, c: cc }) => {
              ce.classList.toggle("highlight", cr <= r && cc <= c);
            });
          },
          onClick: () => {
            restoreSelection(savedRange);
            let html = "<table><tbody>";
            for (let ri = 0; ri < tRows; ri++) {
              html += "<tr>";
              for (let ci = 0; ci < tCols; ci++) {
                html += ri === 0 ? "<th>&nbsp;</th>" : "<td>&nbsp;</td>";
              }
              html += "</tr>";
            }
            html += "</tbody></table><p><br></p>";
            exec("insertHTML", html);
            tablePopup.classList.remove("show");
          }
        });
        tableCells.push({ el: cell, r, c });
        tableGrid.appendChild(cell);
      }
    }
    tablePopup.append(tableGrid, tableSizeLabel);
    allPopups.push(tablePopup);

    // ── Toggle popup helper ──
    function togglePopup(popup) {
      allPopups.forEach(p => { if (p !== popup) p.classList.remove("show"); });
      savedRange = saveSelection();
      popup.classList.toggle("show");
      popup.style.top = toolbar.offsetHeight + 4 + "px";
      popup.style.left = "8px";
    }

    // Close popups when clicking inside editor
    content.addEventListener("mousedown", (e) => {
      allPopups.forEach(p => p.classList.remove("show"));
      if (e.target.tagName !== "IMG") clearImageResize();
    });

    // ── Link popup wiring ──
    linkPopup.querySelector(".rte-link-cancel").addEventListener("click", () => linkPopup.classList.remove("show"));
    linkPopup.querySelector(".rte-link-ok").addEventListener("click", () => {
      const url = linkPopup.querySelector(".rte-link-url").value;
      const text = linkPopup.querySelector(".rte-link-text").value.trim();
      if (url) {
        restoreSelection(savedRange);
        if (text) {
          const a = '<a href="' + url.replace(/"/g, "&quot;") + '">' + text.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</a>';
          exec("insertHTML", a);
        } else {
          exec("createLink", url);
        }
        linkPopup.classList.remove("show");
        linkPopup.querySelector(".rte-link-url").value = "";
        linkPopup.querySelector(".rte-link-text").value = "";
      }
    });

    // ── Create format buttons with tracking ──
    const boldBtn = fmtBtn("B", "Bold (Ctrl+B)", () => exec("bold"), "fmt-bold");
    formatButtons.bold = boldBtn;

    const italicBtn = fmtBtn("I", "Italic (Ctrl+I)", () => exec("italic"), "fmt-italic");
    formatButtons.italic = italicBtn;

    const underlineBtn = fmtBtn("U", "Underline (Ctrl+U)", () => exec("underline"), "fmt-underline");
    formatButtons.underline = underlineBtn;

    const strikeBtn = fmtBtn("S", "Strikethrough", () => exec("strikeThrough"), "fmt-strike");
    formatButtons.strike = strikeBtn;

    const supBtn = fmtBtn("X\u00b2", "Superscript", () => exec("superscript"), "fmt-sup");
    formatButtons.sup = supBtn;

    const subBtn = fmtBtn("X\u2082", "Subscript", () => exec("subscript"), "fmt-sub");
    formatButtons.sub = subBtn;

    // ── Build Toolbar ──────────────────────────────────────
    toolbar.append(
      tipWrap(headingSelect, "Block Format \u2014 Paragraph / Headings"),
      tipWrap(fontSelect, "Font Family"),
      tipWrap(sizeSelect, "Font Size"),
      sep(),

      // Formatting: recognizable styled letters
      boldBtn,
      italicBtn,
      underlineBtn,
      strikeBtn,
      supBtn,
      subBtn,
      sep(),

      // Colors
      btn("\ud83c\udfa8", "Text Color", () => togglePopup(textColorPopup)),
      btn("\ud83d\udd8d\ufe0f", "Highlight", () => togglePopup(bgColorPopup)),
      sep(),

      // Alignment — traditional line icons
      btn(alignIcon("left"), "Align Left", () => exec("justifyLeft")),
      btn(alignIcon("center"), "Align Center", () => exec("justifyCenter")),
      btn(alignIcon("right"), "Align Right", () => exec("justifyRight")),
      btn(alignIcon("justify"), "Justify", () => exec("justifyFull")),
      sep(),

      // Lists
      btn("\ud83d\udcdd", "Bullet List", () => exec("insertUnorderedList")),
      btn("\ud83d\udd22", "Numbered List", () => exec("insertOrderedList")),
      btn("\u27a1\ufe0f\ud83d\udccf", "Indent", () => exec("indent")),
      btn("\u2b05\ufe0f\ud83d\udccf", "Outdent", () => exec("outdent")),
      sep(),

      // Insert
      btn("\ud83d\udd17", "Insert Link", () => togglePopup(linkPopup)),
      btn("\u26d3\ufe0f\u200d\ud83d\udca5", "Unlink", () => exec("unlink")),
      btn("\ud83d\uddbc\ufe0f", "Insert Image", () => togglePopup(imagePopup)),
      btn("\ud83c\udfac", "Insert Video", () => togglePopup(videoPopup)),
      btn("\ud83d\udd0a", "Insert Audio", () => togglePopup(audioPopup)),
      btn("\ud83d\ude00", "Insert Emoji", () => togglePopup(emojiPopup)),
      btn("\ud83d\udcca", "Insert Table", () => togglePopup(tablePopup)),
      sep(),

      // Block
      btn("\ud83d\udcac", "Blockquote", () => exec("formatBlock", "<blockquote>")),
      btn("\ud83d\udcbb", "Code Block", () => exec("formatBlock", "<pre>")),
      btn("\u2796", "Horizontal Rule", () => exec("insertHorizontalRule")),
      sep(),

      // Cut / Copy / Paste
      btn("\u2702\ufe0f", "Cut (Ctrl+X)", () => editorCut()),
      btn("\u{1F4CB}", "Copy (Ctrl+C)", () => editorCopy()),
      btn("\u{1F4CC}", "Paste (Ctrl+V)", () => editorPaste()),
      sep(),

      // Utility
      btn("\u21a9\ufe0f", "Undo (Ctrl+Z)", () => exec("undo")),
      btn("\u21aa\ufe0f", "Redo (Ctrl+Y)", () => exec("redo")),
      btn("\ud83e\uddf9", "Clear Formatting", () => exec("removeFormat")),
      btn("\ud83d\uddd1\ufe0f", "Clear All", () => { if (confirm("Clear all content?")) { content.innerHTML = ""; updateStatus(); } }),
    );

    // ── Toast notification ───────────────────────────────────
    const toast = el("div", { className: "rte-toast" });
    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }

    // ── Full HTML document wrapper for export/email ────────
    function cleanHTML() {
      const clone = content.cloneNode(true);
      clone.querySelectorAll(".rte-img-resizing").forEach(el => el.classList.remove("rte-img-resizing"));
      clone.querySelectorAll(".rte-img-resize-overlay").forEach(el => el.remove());
      clone.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));
      return clone.innerHTML;
    }
    function getFullHTML() {
      if (options.exportTemplate) {
        return options.exportTemplate.replace('{{content}}', cleanHTML());
      }
      var css = 'body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px 32px;line-height:1.7;color:#1e293b;max-width:800px;margin:0 auto}img,video{max-width:100%;border-radius:8px}audio{max-width:100%}table{border-collapse:collapse;width:100%}td,th{border:1px solid #d0d5dd;padding:8px 12px;text-align:left}th{background:#f8f9fb;font-weight:600}blockquote{border-left:4px solid #6366f1;margin:.6em 0;padding:.4em .8em;background:#f1f5f9}pre{background:#1e293b;color:#e2e8f0;padding:12px 16px;border-radius:8px;overflow-x:auto;font-size:13px}a{color:#6366f1}hr{border:none;border-top:2px dashed #d0d5dd;margin:1em 0}';
      if (options.exportCSS) css += options.exportCSS;
      return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><style>' + css + '</style></head><body>' + cleanHTML() + '</body></html>';
    }

    // ── Export bar (save, copy, email, etc.) ────────────────
    const exportBar = el("div", { className: "rte-exportbar" });

    const filenameInput = el("input", {
      className: "rte-filename-input",
      type: "text",
      placeholder: "document",
      title: "Export filename (without extension)"
    });

    function getFilename(ext) {
      const base = filenameInput.value.trim().replace(/\.[^.]+$/, "") || "document";
      return base + ext;
    }

    function exportBtn(icon, label, tip, onClick) {
      const b = el("button", { className: "rte-export-btn", title: tip, onClick });
      b.innerHTML = '<span class="rte-export-icon">' + icon + '</span> ' + label;
      return b;
    }

    exportBar.append(
      filenameInput,

      exportBtn("\ud83d\udcbe", "Save HTML", "Download as an HTML file", () => {
        const blob = new Blob([getFullHTML()], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = getFilename(".html");
        a.click();
        URL.revokeObjectURL(a.href);
        showToast("\u2705 HTML file downloaded");
      }),

      exportBtn("\ud83d\udcc4", "Save Text", "Download as a plain text file", () => {
        const blob = new Blob([content.innerText], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = getFilename(".txt");
        a.click();
        URL.revokeObjectURL(a.href);
        showToast("\u2705 Text file downloaded");
      }),

      exportBtn("\ud83d\udccb", "Copy HTML", "Copy rich HTML to clipboard", () => {
        const htmlStr = content.innerHTML;
        const textStr = content.innerText;
        if (navigator.clipboard && navigator.clipboard.write) {
          const blob = new Blob([htmlStr], { type: "text/html" });
          const textBlob = new Blob([textStr], { type: "text/plain" });
          navigator.clipboard.write([
            new ClipboardItem({ "text/html": blob, "text/plain": textBlob })
          ]).then(() => showToast("\u2705 HTML copied to clipboard"));
        } else {
          navigator.clipboard.writeText(htmlStr).then(() => showToast("\u2705 HTML source copied"));
        }
      }),

      exportBtn("\ud83d\udcdd", "Copy Text", "Copy plain text to clipboard", () => {
        navigator.clipboard.writeText(content.innerText)
          .then(() => showToast("\u2705 Text copied to clipboard"));
      }),

      exportBtn("\u2709\ufe0f", "Email", "Copy rich HTML to clipboard for pasting into email", () => {
        const htmlStr = cleanHTML();
        const textStr = content.innerText;
        if (navigator.clipboard && navigator.clipboard.write) {
          const blob = new Blob([htmlStr], { type: "text/html" });
          const textBlob = new Blob([textStr], { type: "text/plain" });
          navigator.clipboard.write([
            new ClipboardItem({ "text/html": blob, "text/plain": textBlob })
          ]).then(() => showToast("\u2705 Content copied — paste into your email with Ctrl+V"));
        } else {
          navigator.clipboard.writeText(textStr)
            .then(() => showToast("\u2705 Text copied — paste into your email with Ctrl+V"));
        }
      }),

      exportBtn("\ud83d\udda8\ufe0f", "Print", "Print or save as PDF", () => {
        const win = window.open("", "_blank");
        win.document.write(getFullHTML());
        win.document.close();
        win.print();
      }),

      exportBtn("\ud83d\udcbe", "JSON", "Copy content as JSON (for APIs & databases)", () => {
        const json = JSON.stringify({
          html: content.innerHTML,
          text: content.innerText,
          wordCount: (content.innerText.trim() ? content.innerText.trim().split(/\s+/).length : 0),
          charCount: content.innerText.length,
          createdAt: new Date().toISOString(),
        }, null, 2);
        navigator.clipboard.writeText(json)
          .then(() => showToast("\u2705 JSON copied to clipboard"));
      })
    );

    // ── Assemble ──
    wrap.append(toolbar);
    allPopups.forEach(p => wrap.appendChild(p));
    const _dragWrap = el("div", { style: { position: "relative" } });
    _dragWrap.append(content);
    wrap.append(_dragWrap, exportBar, statusbar, toast);
    target.appendChild(wrap);

    // ── Status updates ─────────────────────────────────────
    function updateStatus() {
      const text = content.innerText || "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      wordCount.textContent = "\ud83d\udcdd Words: " + words;
      charCount.textContent = "\ud83d\udd24 Chars: " + text.length;
      // Fire onChange callback if set
      if (typeof api.onChange === "function") {
        api.onChange({ html: content.innerHTML, text: text, words: words, chars: text.length });
      }
    }
    content.addEventListener("input", updateStatus);
    content.addEventListener("keyup", () => { updateStatus(); updateActiveStates(); });
    content.addEventListener("mouseup", updateActiveStates);

    // ── Keyboard shortcuts ─────────────────────────────────
    content.addEventListener("keydown", (e) => {
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
          case "s": e.preventDefault(); // Ctrl+S = save HTML file
            var blob = new Blob([getFullHTML()], { type: "text/html" });
            var a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = getFilename(".html");
            a.click();
            URL.revokeObjectURL(a.href);
            showToast("\u2705 Saved (Ctrl+S)");
            break;
          case "z":
            if (e.shiftKey) { e.preventDefault(); exec("redo"); }
            break;
          case "x": if (resizeImg) { e.preventDefault(); editorCut(); } break;
          case "c": if (resizeImg) { e.preventDefault(); editorCopy(); } break;
          case "y": e.preventDefault(); exec("redo"); break;
        }
      }
    });

    // ── Drag & Drop media ──────────────────────────────────
    content.addEventListener("dragover", (e) => { e.preventDefault(); });
    content.addEventListener("drop", (e) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files.length) return;
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (file.type.startsWith("image/")) {
            exec("insertHTML", '<img src="' + reader.result + '" alt="' + file.name + '">');
          } else if (file.type.startsWith("video/")) {
            exec("insertHTML", '<video src="' + reader.result + '" controls></video>');
          } else if (file.type.startsWith("audio/")) {
            exec("insertHTML", '<audio src="' + reader.result + '" controls></audio>');
          }
        };
        reader.readAsDataURL(file);
      });
    });

    // ── Paste image from clipboard ─────────────────────────
    content.addEventListener("paste", (e) => {
      const items = (e.clipboardData || {}).items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault();
          const file = items[i].getAsFile();
          const reader = new FileReader();
          reader.onload = () => {
            exec("insertHTML", '<img src="' + reader.result + '" alt="pasted image">');
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    });

    // ── Cut / Copy / Paste helpers ────────────────────────
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

    // ── Image Resize System ───────────────────────────────
    let resizeOverlay = null;
    let resizeImg = null;
    let resizeDragging = false;
    let resizeStartX = 0;
    let resizeStartWidth = 0;
    let resizeAspect = 1;

    function clearImageResize() {
      if (resizeOverlay) { resizeOverlay.remove(); resizeOverlay = null; }
      if (resizeImg) { resizeImg.classList.remove("rte-img-resizing"); resizeImg = null; }
      resizeDragging = false;
    }

    function positionOverlay() {
      if (!resizeOverlay || !resizeImg) return;
      const imgRect = resizeImg.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      resizeOverlay.style.top = (imgRect.top - wrapRect.top) + "px";
      resizeOverlay.style.left = (imgRect.left - wrapRect.left) + "px";
      resizeOverlay.style.width = imgRect.width + "px";
      resizeOverlay.style.height = imgRect.height + "px";
    }

    function selectImageForResize(img) {
      clearImageResize();
      resizeImg = img;
      img.classList.add("rte-img-resizing");

      resizeOverlay = document.createElement("div");
      resizeOverlay.className = "rte-img-resize-overlay";
      ["nw", "ne", "sw", "se"].forEach(pos => {
        const handle = document.createElement("div");
        handle.className = "rte-img-resize-handle " + pos;
        handle.addEventListener("mousedown", (e) => {
          e.preventDefault();
          e.stopPropagation();
          resizeDragging = true;
          resizeStartX = e.clientX;
          resizeStartWidth = resizeImg.getBoundingClientRect().width;
          resizeAspect = resizeImg.naturalHeight / resizeImg.naturalWidth;
        });
        resizeOverlay.appendChild(handle);
      });

      wrap.appendChild(resizeOverlay);
      positionOverlay();
    }

    content.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        e.preventDefault();
        selectImageForResize(e.target);
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (!resizeDragging || !resizeImg) return;
      const dx = e.clientX - resizeStartX;
      const newWidth = Math.max(20, resizeStartWidth + dx);
      resizeImg.style.width = newWidth + "px";
      resizeImg.style.height = "auto";
      positionOverlay();
    });

    document.addEventListener("mouseup", () => {
      if (resizeDragging) {
        resizeDragging = false;
        updateStatus();
      }
    });

    content.addEventListener("scroll", positionOverlay);
    content.addEventListener("input", positionOverlay);

    document.addEventListener("keydown", (e) => {
      if (!resizeImg) return;
      if (e.key === "Escape") {
        clearImageResize();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        resizeImg.remove();
        clearImageResize();
        updateStatus();
      }
    });

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

    // ── Public API ─────────────────────────────────────────
    const api = {
      /** Get editor HTML content */
      getHTML: () => cleanHTML(),
      /** Set HTML content */
      setHTML: (html) => { content.innerHTML = html; updateStatus(); },
      /** Get plain text */
      getText: () => content.innerText,
      /** Get a standalone HTML document (for saving/emailing) */
      getFullHTML: getFullHTML,
      /** Get content as a JSON object */
      getJSON: () => {
        return {
          html: cleanHTML(),
          text: content.innerText,
          wordCount: (content.innerText.trim() ? content.innerText.trim().split(/\s+/).length : 0),
          charCount: content.innerText.length,
          createdAt: new Date().toISOString(),
        };
      },
      /** Download content as HTML file */
      saveHTML: (filename) => {
        const blob = new Blob([getFullHTML()], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename || getFilename(".html");
        a.click();
        URL.revokeObjectURL(a.href);
      },
      /** Download content as plain text file */
      saveText: (filename) => {
        const blob = new Blob([content.innerText], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename || getFilename(".txt");
        a.click();
        URL.revokeObjectURL(a.href);
      },
      /** Copy rich HTML to clipboard */
      copyHTML: () => {
        const htmlStr = content.innerHTML;
        const textStr = content.innerText;
        if (navigator.clipboard && navigator.clipboard.write) {
          return navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([htmlStr], { type: "text/html" }),
              "text/plain": new Blob([textStr], { type: "text/plain" }),
            })
          ]);
        }
        return navigator.clipboard.writeText(htmlStr);
      },
      /** Copy plain text to clipboard */
      copyText: () => navigator.clipboard.writeText(content.innerText),
      /** Copy rich HTML content to clipboard for pasting into email */
      email: () => {
        const htmlStr = content.innerHTML;
        const textStr = content.innerText;
        if (navigator.clipboard && navigator.clipboard.write) {
          const blob = new Blob([htmlStr], { type: "text/html" });
          const textBlob = new Blob([textStr], { type: "text/plain" });
          return navigator.clipboard.write([
            new ClipboardItem({ "text/html": blob, "text/plain": textBlob })
          ]);
        }
        return navigator.clipboard.writeText(textStr);
      },
      /** Print content */
      print: () => {
        const win = window.open("", "_blank");
        win.document.write(getFullHTML());
        win.document.close();
        win.print();
      },
      /** Assign a callback: editor.onChange = ({html, text, words, chars}) => {} */
      onChange: null,
      /** Focus the editor */
      focus: () => content.focus(),
      /** Destroy the editor */
      destroy: () => { clearImageResize(); wrap.remove(); },
      /** Direct access to the content element */
      element: content,
      /** Direct access to the wrapper */
      wrapper: wrap,
    };
    return api;
  }

  // ── Return public API ────────────────────────────────────
  return { init };
});
