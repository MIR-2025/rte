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
 *   <script src="rte.js"></script>
 *   <script src="rte-ws.js"></script>
 *   <script>
 *     const editor = RTE.init('#editor');
 *     const ws = RTEWS.connect(editor, 'wss://yourserver.com/ws', {
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
    root.RTEWS = factory();
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
