/**
 * WSKit — Universal WebSocket Client
 * Standalone. Zero dependencies. Works with any backend.
 *
 * Usage:
 *   <script src="wskit.js"></script>
 *   <script>
 *     const ws = WSKit.connect('wss://yourserver.com/ws', {
 *       onOpen: () => console.log('Connected'),
 *       onMessage: (msg) => console.log('Received:', msg),
 *       onClose: () => console.log('Disconnected'),
 *     });
 *
 *     ws.send({ type: 'chat', text: 'Hello!' });
 *   </script>
 *
 * Features:
 *   - JSON auto-serialize/deserialize
 *   - Event channels (subscribe/publish by message type)
 *   - Auto-reconnect with exponential backoff
 *   - Heartbeat keep-alive
 *   - Message queue (buffers sends while disconnected)
 *   - Request/response pattern with promises
 *   - Connection state tracking
 *   - Debug logging
 */
(function (root, factory) {
  "use strict";
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WSKit = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var DEFAULTS = {
    // Reconnection
    reconnect: true,
    reconnectBaseMs: 1000,
    reconnectMaxMs: 30000,
    maxReconnectAttempts: 0, // 0 = unlimited

    // Heartbeat
    heartbeatMs: 30000,
    heartbeatMessage: { type: "ping" },

    // Message queue
    queueWhileDisconnected: true,
    maxQueueSize: 100,

    // JSON
    autoJSON: true, // auto parse/stringify JSON messages
    typeField: "type", // field used for channel routing

    // Request/response
    requestTimeout: 10000,
    idField: "_id", // field for matching request/response

    // Debug
    debug: false,

    // Callbacks
    onOpen: null,
    onClose: null,
    onError: null,
    onMessage: null,
    onReconnect: null,
    onStateChange: null,
  };

  function connect(url, opts) {
    var cfg = {};
    var key;
    for (key in DEFAULTS) cfg[key] = DEFAULTS[key];
    if (opts) for (key in opts) cfg[key] = opts[key];

    var ws = null;
    var state = "closed";
    var reconnectAttempts = 0;
    var reconnectTimer = null;
    var heartbeatTimer = null;
    var destroyed = false;
    var messageQueue = [];
    var channels = {};
    var pendingRequests = {};
    var requestCounter = 0;

    // ── Logging ──────────────────────────────────────────

    function log() {
      if (cfg.debug && typeof console !== "undefined") {
        var args = ["[WSKit]"];
        for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
        console.log.apply(console, args);
      }
    }

    // ── State management ─────────────────────────────────

    function setState(newState) {
      if (state !== newState) {
        var prev = state;
        state = newState;
        log("State:", prev, "→", newState);
        if (cfg.onStateChange) cfg.onStateChange(newState, prev);
      }
    }

    // ── Connection ───────────────────────────────────────

    function open() {
      if (destroyed) return;
      setState("connecting");

      try {
        ws = new WebSocket(url);
      } catch (e) {
        log("Connection error:", e);
        if (cfg.onError) cfg.onError(e);
        if (cfg.reconnect) scheduleReconnect();
        return;
      }

      ws.onopen = function () {
        reconnectAttempts = 0;
        setState("open");
        startHeartbeat();
        flushQueue();
        log("Connected to", url);
        if (cfg.onOpen) cfg.onOpen();
      };

      ws.onmessage = function (e) {
        var data = e.data;

        if (cfg.autoJSON) {
          try {
            data = JSON.parse(data);
          } catch (_) {
            // Not JSON, keep as string
          }
        }

        log("Received:", data);

        // Check for request/response match
        if (data && typeof data === "object" && data[cfg.idField] && pendingRequests[data[cfg.idField]]) {
          var req = pendingRequests[data[cfg.idField]];
          clearTimeout(req.timer);
          delete pendingRequests[data[cfg.idField]];
          req.resolve(data);
          return;
        }

        // Route to channel handlers
        if (data && typeof data === "object" && data[cfg.typeField] && channels[data[cfg.typeField]]) {
          var handlers = channels[data[cfg.typeField]];
          for (var i = 0; i < handlers.length; i++) {
            handlers[i](data);
          }
        }

        // Global handler
        if (cfg.onMessage) cfg.onMessage(data);
      };

      ws.onclose = function (e) {
        stopHeartbeat();
        setState("closed");
        log("Disconnected. Code:", e.code, "Reason:", e.reason);
        if (cfg.onClose) cfg.onClose(e);
        if (cfg.reconnect && !destroyed) scheduleReconnect();
      };

      ws.onerror = function (e) {
        log("Error:", e);
        if (cfg.onError) cfg.onError(e);
      };
    }

    // ── Send ─────────────────────────────────────────────

    function send(data) {
      var payload = data;
      if (cfg.autoJSON && typeof data === "object") {
        payload = JSON.stringify(data);
      }

      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
        log("Sent:", data);
        return true;
      }

      if (cfg.queueWhileDisconnected) {
        if (messageQueue.length < cfg.maxQueueSize) {
          messageQueue.push(payload);
          log("Queued:", data, "(" + messageQueue.length + " in queue)");
        } else {
          log("Queue full, dropping message");
        }
      }

      return false;
    }

    function flushQueue() {
      while (messageQueue.length > 0 && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(messageQueue.shift());
      }
      if (messageQueue.length === 0) {
        log("Queue flushed");
      }
    }

    // ── Request/Response ─────────────────────────────────

    function request(data, timeoutMs) {
      return new Promise(function (resolve, reject) {
        var id = "_wskit_" + (++requestCounter);
        var msg = {};
        if (typeof data === "object") {
          for (var k in data) msg[k] = data[k];
        }
        msg[cfg.idField] = id;

        var timer = setTimeout(function () {
          delete pendingRequests[id];
          reject(new Error("Request timeout after " + (timeoutMs || cfg.requestTimeout) + "ms"));
        }, timeoutMs || cfg.requestTimeout);

        pendingRequests[id] = { resolve: resolve, reject: reject, timer: timer };
        send(msg);
      });
    }

    // ── Channels ─────────────────────────────────────────

    function on(type, handler) {
      if (!channels[type]) channels[type] = [];
      channels[type].push(handler);
      return function off() {
        var idx = channels[type].indexOf(handler);
        if (idx > -1) channels[type].splice(idx, 1);
      };
    }

    function off(type, handler) {
      if (!channels[type]) return;
      if (handler) {
        var idx = channels[type].indexOf(handler);
        if (idx > -1) channels[type].splice(idx, 1);
      } else {
        delete channels[type];
      }
    }

    // ── Reconnect ────────────────────────────────────────

    function scheduleReconnect() {
      if (destroyed) return;
      if (cfg.maxReconnectAttempts > 0 && reconnectAttempts >= cfg.maxReconnectAttempts) {
        log("Max reconnect attempts reached (" + cfg.maxReconnectAttempts + ")");
        return;
      }
      reconnectAttempts++;
      var delay = Math.min(
        cfg.reconnectBaseMs * Math.pow(2, reconnectAttempts - 1),
        cfg.reconnectMaxMs
      );
      log("Reconnecting in", delay + "ms", "(attempt " + reconnectAttempts + ")");
      setState("reconnecting");
      reconnectTimer = setTimeout(function () {
        if (cfg.onReconnect) cfg.onReconnect(reconnectAttempts);
        open();
      }, delay);
    }

    // ── Heartbeat ────────────────────────────────────────

    function startHeartbeat() {
      stopHeartbeat();
      if (cfg.heartbeatMs > 0) {
        heartbeatTimer = setInterval(function () {
          send(cfg.heartbeatMessage);
        }, cfg.heartbeatMs);
      }
    }

    function stopHeartbeat() {
      if (heartbeatTimer) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = null;
      }
    }

    // ── Lifecycle ────────────────────────────────────────

    function disconnect() {
      destroyed = true;
      clearTimeout(reconnectTimer);
      stopHeartbeat();
      // Reject all pending requests
      for (var id in pendingRequests) {
        clearTimeout(pendingRequests[id].timer);
        pendingRequests[id].reject(new Error("Disconnected"));
      }
      pendingRequests = {};
      if (ws) ws.close();
      setState("closed");
    }

    function reconnectNow() {
      destroyed = false;
      if (ws && ws.readyState !== WebSocket.CLOSED) ws.close();
      reconnectAttempts = 0;
      open();
    }

    // ── Start ────────────────────────────────────────────

    open();

    // ── Public API ───────────────────────────────────────

    return {
      /** Send data (auto-serialized to JSON if autoJSON is true) */
      send: send,

      /** Send a request and wait for a matching response (returns Promise) */
      request: request,

      /** Subscribe to a message type. Returns an unsubscribe function. */
      on: on,

      /** Unsubscribe from a message type */
      off: off,

      /** Close connection and stop reconnecting */
      disconnect: disconnect,

      /** Manually reconnect */
      reconnect: reconnectNow,

      /** Clear the message queue */
      clearQueue: function () {
        messageQueue = [];
      },

      /** Get connection state: "connecting" | "open" | "closed" | "reconnecting" */
      get state() {
        return state;
      },

      /** Get number of messages in the queue */
      get queueSize() {
        return messageQueue.length;
      },

      /** Get the raw WebSocket instance */
      get socket() {
        return ws;
      },

      /** Get the WebSocket URL */
      get url() {
        return url;
      },

      /** Get the number of reconnect attempts */
      get reconnectAttempts() {
        return reconnectAttempts;
      },
    };
  }

  return { connect: connect };
});
