/** RTE — Rich Text Editor TypeScript declarations */

export interface RTEOptions {
  /** Placeholder text shown when the editor is empty */
  placeholder?: string;
  /** Minimum height of the editor area (CSS value, e.g. "400px") */
  height?: string;
}

export interface RTEChangeData {
  html: string;
  text: string;
  words: number;
  chars: number;
}

export interface RTEJSON {
  html: string;
  text: string;
  wordCount: number;
  charCount: number;
  createdAt: string;
}

export interface RTEInstance {
  /** Get the editor's inner HTML content */
  getHTML(): string;
  /** Set the editor's HTML content */
  setHTML(html: string): void;
  /** Get plain text content */
  getText(): string;
  /** Get a complete standalone HTML document with embedded styles */
  getFullHTML(): string;
  /** Get content as a structured JSON object */
  getJSON(): RTEJSON;
  /** Trigger a file download of the HTML document */
  saveHTML(filename?: string): void;
  /** Trigger a file download of plain text */
  saveText(filename?: string): void;
  /** Copy rich HTML to clipboard */
  copyHTML(): Promise<void>;
  /** Copy plain text to clipboard */
  copyText(): Promise<void>;
  /** Copy rich HTML to clipboard for pasting into email */
  email(): Promise<void>;
  /** Open a styled print preview */
  print(): void;
  /** Focus the editor */
  focus(): void;
  /** Remove the editor from the DOM */
  destroy(): void;
  /** The contenteditable div element */
  element: HTMLDivElement;
  /** The outer .rte-wrap container element */
  wrapper: HTMLDivElement;
  /** Callback fired on every content change */
  onChange: ((data: RTEChangeData) => void) | null;
}

export interface RTE {
  /** Initialize a new editor instance */
  init(selector: string | HTMLElement, options?: RTEOptions): RTEInstance | null;
}

/** RTE-WS — WebSocket Connector TypeScript declarations */

export interface RTEWSOptions {
  /** Document identifier sent with all messages */
  docId?: string;
  /** User identifier for collaboration */
  userId?: string;
  /** Milliseconds to debounce before sending changes */
  debounceMs?: number;
  /** Automatically send changes on editor input */
  autoSave?: boolean;
  /** Auto-reconnect on disconnect */
  reconnect?: boolean;
  /** Initial reconnect delay in ms (doubles each attempt) */
  reconnectBaseMs?: number;
  /** Maximum reconnect delay in ms */
  reconnectMaxMs?: number;
  /** Ping interval in ms (0 to disable) */
  heartbeatMs?: number;
  /** Called when WebSocket connects */
  onOpen?: (ws: WebSocket) => void;
  /** Called when WebSocket closes */
  onClose?: (e: CloseEvent) => void;
  /** Called on error */
  onError?: (e: Event | Error) => void;
  /** Called when server confirms a save */
  onSaved?: (msg: any) => void;
  /** Called when a remote user's change is applied */
  onRemoteUpdate?: (msg: any) => void;
  /** Called for every incoming message */
  onMessage?: (msg: any) => void;
}

export interface RTEWSConnection {
  /** Send an explicit save request */
  save(): boolean;
  /** Send a custom JSON message */
  send(data: any): boolean;
  /** Close the connection and stop reconnecting */
  disconnect(): void;
  /** Manually reconnect */
  reconnect(): void;
  /** Connection state */
  readonly state: "connecting" | "open" | "closing" | "closed";
  /** The raw WebSocket instance */
  readonly socket: WebSocket | null;
}

export interface RTEWS {
  /** Connect to a WebSocket server */
  connect(editor: RTEInstance, url: string, options?: RTEWSOptions): RTEWSConnection;
}

declare const RTE: RTE;
declare const RTEWS: RTEWS;
export default RTE;
export { RTEWS };
