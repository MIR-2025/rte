/** WSKit — Universal WebSocket Client TypeScript declarations */

export interface WSKitOptions {
  /** Auto-reconnect on disconnect (default: true) */
  reconnect?: boolean;
  /** Initial reconnect delay in ms (default: 1000) */
  reconnectBaseMs?: number;
  /** Max reconnect delay in ms (default: 30000) */
  reconnectMaxMs?: number;
  /** Max reconnect attempts, 0 = unlimited (default: 0) */
  maxReconnectAttempts?: number;

  /** Heartbeat ping interval in ms, 0 to disable (default: 30000) */
  heartbeatMs?: number;
  /** Heartbeat message payload (default: { type: "ping" }) */
  heartbeatMessage?: any;

  /** Buffer sends while disconnected (default: true) */
  queueWhileDisconnected?: boolean;
  /** Max queued messages (default: 100) */
  maxQueueSize?: number;

  /** Auto parse/stringify JSON (default: true) */
  autoJSON?: boolean;
  /** Field used for channel routing (default: "type") */
  typeField?: string;

  /** Timeout for request/response in ms (default: 10000) */
  requestTimeout?: number;
  /** Field for matching request/response (default: "_id") */
  idField?: string;

  /** Enable debug logging (default: false) */
  debug?: boolean;

  /** Called when WebSocket connects */
  onOpen?: () => void;
  /** Called when WebSocket closes */
  onClose?: (e: CloseEvent) => void;
  /** Called on error */
  onError?: (e: Event | Error) => void;
  /** Called for every incoming message */
  onMessage?: (data: any) => void;
  /** Called before each reconnect attempt */
  onReconnect?: (attempt: number) => void;
  /** Called when connection state changes */
  onStateChange?: (newState: WSKitState, prevState: WSKitState) => void;
}

export type WSKitState = "connecting" | "open" | "closed" | "reconnecting";

export interface WSKitConnection {
  /** Send data (auto-serialized to JSON if autoJSON is true) */
  send(data: any): boolean;
  /** Send a request and wait for a matching response */
  request(data: any, timeoutMs?: number): Promise<any>;
  /** Subscribe to a message type. Returns an unsubscribe function. */
  on(type: string, handler: (data: any) => void): () => void;
  /** Unsubscribe from a message type */
  off(type: string, handler?: (data: any) => void): void;
  /** Close connection and stop reconnecting */
  disconnect(): void;
  /** Manually reconnect */
  reconnect(): void;
  /** Clear the message queue */
  clearQueue(): void;
  /** Connection state */
  readonly state: WSKitState;
  /** Number of messages in the queue */
  readonly queueSize: number;
  /** The raw WebSocket instance */
  readonly socket: WebSocket | null;
  /** The WebSocket URL */
  readonly url: string;
  /** Number of reconnect attempts */
  readonly reconnectAttempts: number;
}

export interface WSKit {
  /** Connect to a WebSocket server */
  connect(url: string, options?: WSKitOptions): WSKitConnection;
}

declare const WSKit: WSKit;
export default WSKit;
