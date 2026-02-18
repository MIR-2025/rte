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
}

interface RTEProStatic {
  init(selector: string, options?: RTEProOptions): RTEProInstance;
}

declare const RTEPro: RTEProStatic;
export default RTEPro;
export { RTEPro, RTEProOptions, RTEProInstance, RTEProMention };
