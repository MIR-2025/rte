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
  /** Open the user's email client with editor content */
  email(to?: string, subject?: string): void;
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

declare const RTE: RTE;
export default RTE;
export declare const init: RTE["init"];
