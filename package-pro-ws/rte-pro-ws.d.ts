// ── RTEPro ──

interface RTEProMention {
  name: string;
  id: string;
  avatar?: string;
}

interface RTEProOptions {
  placeholder?: string;
  height?: string;
  exportCSS?: string;
  exportTemplate?: string;
  apiKey?: string | null;
  aiModel?: string;
  toolbar?: string[] | null;
  autosave?: boolean | number;
  autosaveKey?: string;
  wordGoal?: number;
  charGoal?: number;
  spellcheck?: boolean;
  direction?: "ltr" | "rtl";
  mentions?: RTEProMention[];
  hashtagUrl?: string | null;
  printMargins?: string | null;
  watermark?: string | null;
  stickyToolbar?: boolean;
  focusMode?: boolean;
  maxVersions?: number;
}

interface RTEProInstance {
  getHTML(): string;
  getText(): string;
  getJSON(): { html: string; text: string; words: number; chars: number };
  getFullHTML(): string;
  getMarkdown(): string;
  setHTML(html: string): void;
  focus(): void;
  blur(): void;
  isEmpty(): boolean;
  getWordCount(): number;
  getCharCount(): number;
  insertAtCursor(html: string): void;
  toggleFullscreen(): void;
  toggleSource(): void;
  toggleMarkdown(): void;
  toggleGridlines(): void;
  toggleFindBar(): void;
  toggleFocusMode(): void;
  toggleSpellcheck(): void;
  saveVersion(label?: string): void;
  getReadability(): { score: number; grade: string; level: string };
  getSEOIssues(): string[];
  getAccessibilityIssues(): string[];
  print(): void;
  destroy(): void;
  onChange?: (stats: { words: number; chars: number }) => void;
  element: HTMLElement;
  wrapper: HTMLElement;
}

interface RTEProStatic {
  init(selector: string, options?: RTEProOptions): RTEProInstance;
}

declare const RTEPro: RTEProStatic;

// ── RTEProWS ──

interface RTEProWSOptions {
  docId?: string | null;
  userId?: string | null;
  debounceMs?: number;
  reconnect?: boolean;
  reconnectMaxMs?: number;
  reconnectBaseMs?: number;
  heartbeatMs?: number;
  autoSave?: boolean;
  onOpen?: ((ws: WebSocket) => void) | null;
  onClose?: ((e: CloseEvent) => void) | null;
  onError?: ((e: Event | Error) => void) | null;
  onSaved?: ((msg: any) => void) | null;
  onRemoteUpdate?: ((msg: any) => void) | null;
  onMessage?: ((msg: any) => void) | null;
}

interface RTEProWSInstance {
  save(): boolean;
  send(data: any): boolean;
  disconnect(): void;
  reconnect(): void;
  readonly state: "connecting" | "open" | "closing" | "closed";
  readonly socket: WebSocket | null;
}

interface RTEProWSStatic {
  connect(editor: RTEProInstance, url: string, options?: RTEProWSOptions): RTEProWSInstance;
}

declare const RTEProWS: RTEProWSStatic;

export default RTEPro;
export { RTEPro, RTEProStatic, RTEProOptions, RTEProInstance, RTEProMention };
export { RTEProWS, RTEProWSStatic, RTEProWSOptions, RTEProWSInstance };
