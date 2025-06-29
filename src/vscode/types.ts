export interface Disposable {
  dispose(): void;
}

export type Event<T> = (listener: (e: T) => any, thisArgs?: any, disposables?: Disposable[]) => Disposable;

// Document and Editor types
export interface TextDocument {
  uri: Uri;
  fileName: string;
  isUntitled: boolean;
  languageId: string;
  version: number;
  isDirty: boolean;
  isClosed: boolean;
  save(): Thenable<boolean>;
  eol: EndOfLine;
  lineCount: number;
  lineAt(line: number): TextLine;
  offsetAt(position: Position): number;
  positionAt(offset: number): Position;
  getText(range?: Range): string;
  getWordRangeAtPosition(position: Position, regex?: RegExp): Range | undefined;
  validateRange(range: Range): Range;
  validatePosition(position: Position): Position;
}

export interface TextLine {
  lineNumber: number;
  text: string;
  range: Range;
  rangeIncludingLineBreak: Range;
  firstNonWhitespaceCharacterIndex: number;
  isEmptyOrWhitespace: boolean;
}

export interface TextEditor {
  document: TextDocument;
  selection: Selection;
  selections: Selection[];
  visibleRanges: Range[];
  options: TextEditorOptions;
  viewColumn?: ViewColumn;
  edit(callback: (editBuilder: TextEditorEdit) => void): Thenable<boolean>;
  insertSnippet(snippet: SnippetString, location?: Position | Range | Selection | Position[] | Range[] | Selection[]): Thenable<boolean>;
  setDecorations(decorationType: TextEditorDecorationType, rangesOrOptions: Range[] | DecorationOptions[]): void;
  revealRange(range: Range, revealType?: TextEditorRevealType): void;
  show(column?: ViewColumn): void;
  hide(): void;
}

export interface TextEditorEdit {
  replace(location: Position | Range | Selection, value: string): void;
  insert(location: Position, value: string): void;
  delete(location: Range | Selection): void;
  setEndOfLine(endOfLine: EndOfLine): void;
}

export interface TextEditorOptions {
  tabSize?: number | string;
  insertSpaces?: boolean | string;
  cursorStyle?: TextEditorCursorStyle;
  lineNumbers?: TextEditorLineNumbersStyle;
}

// Position and Range types
export class Position {
  constructor(public line: number, public character: number) {}
  
  isBefore(other: Position): boolean {
    return this.line < other.line || (this.line === other.line && this.character < other.character);
  }
  
  isAfter(other: Position): boolean {
    return this.line > other.line || (this.line === other.line && this.character > other.character);
  }
  
  isEqual(other: Position): boolean {
    return this.line === other.line && this.character === other.character;
  }
  
  compareTo(other: Position): number {
    if (this.line < other.line) return -1;
    if (this.line > other.line) return 1;
    if (this.character < other.character) return -1;
    if (this.character > other.character) return 1;
    return 0;
  }
  
  translate(lineDelta?: number, characterDelta?: number): Position {
    return new Position(this.line + (lineDelta || 0), this.character + (characterDelta || 0));
  }
  
  with(line?: number, character?: number): Position {
    return new Position(line ?? this.line, character ?? this.character);
  }
}

export class Range {
  constructor(public start: Position, public end: Position) {}
  
  get isEmpty(): boolean {
    return this.start.isEqual(this.end);
  }
  
  get isSingleLine(): boolean {
    return this.start.line === this.end.line;
  }
  
  contains(positionOrRange: Position | Range): boolean {
    if (positionOrRange instanceof Position) {
      return positionOrRange.isAfter(this.start) && positionOrRange.isBefore(this.end);
    }
    return this.contains(positionOrRange.start) && this.contains(positionOrRange.end);
  }
  
  isEqual(other: Range): boolean {
    return this.start.isEqual(other.start) && this.end.isEqual(other.end);
  }
  
  intersection(range: Range): Range | undefined {
    // Simplified implementation
    return undefined;
  }
  
  union(other: Range): Range {
    return new Range(
      this.start.isBefore(other.start) ? this.start : other.start,
      this.end.isAfter(other.end) ? this.end : other.end
    );
  }
  
  with(start?: Position, end?: Position): Range {
    return new Range(start ?? this.start, end ?? this.end);
  }
}

export class Selection extends Range {
  constructor(
    public anchor: Position,
    public active: Position
  ) {
    super(anchor, active);
  }
  
  get isReversed(): boolean {
    return this.anchor.isAfter(this.active);
  }
}

// Uri type
export interface Uri {
  scheme: string;
  authority: string;
  path: string;
  query: string;
  fragment: string;
  fsPath: string;
  with(change: { scheme?: string; authority?: string; path?: string; query?: string; fragment?: string }): Uri;
  toString(skipEncoding?: boolean): string;
  toJSON(): any;
}

// Workspace types
export interface WorkspaceFolder {
  uri: Uri;
  name: string;
  index: number;
}

export interface WorkspaceConfiguration {
  get<T>(section: string): T | undefined;
  get<T>(section: string, defaultValue: T): T;
  has(section: string): boolean;
  inspect<T>(section: string): { key: string; defaultValue?: T; globalValue?: T; workspaceValue?: T; workspaceFolderValue?: T } | undefined;
  update(section: string, value: any, configurationTarget?: ConfigurationTarget | boolean): Thenable<void>;
}

// Language types
export interface CompletionItem {
  label: string;
  kind?: CompletionItemKind;
  detail?: string;
  documentation?: string;
  sortText?: string;
  filterText?: string;
  insertText?: string;
  range?: Range;
  commitCharacters?: string[];
  keepWhitespace?: boolean;
  command?: Command;
}

export interface CompletionList {
  isIncomplete: boolean;
  items: CompletionItem[];
}

export interface CompletionContext {
  triggerKind: CompletionTriggerKind;
  triggerCharacter?: string;
}

export interface Hover {
  contents: string[];
  range?: Range;
}

export interface SignatureHelp {
  signatures: SignatureInformation[];
  activeSignature: number;
  activeParameter: number;
}

export interface SignatureInformation {
  label: string;
  documentation?: string;
  parameters: ParameterInformation[];
}

export interface ParameterInformation {
  label: string;
  documentation?: string;
}

export interface Location {
  uri: Uri;
  range: Range;
}

export interface Definition {
  uri: Uri;
  range: Range;
}

export interface Diagnostic {
  range: Range;
  message: string;
  severity: DiagnosticSeverity;
  source?: string;
  code?: string | number;
  relatedInformation?: DiagnosticRelatedInformation[];
  tags?: DiagnosticTag[];
}

export interface DiagnosticRelatedInformation {
  location: Location;
  message: string;
}

export interface DiagnosticCollection {
  name: string;
  set(uri: Uri, diagnostics: Diagnostic[] | undefined): void;
  delete(uri: Uri): void;
  clear(): void;
  forEach(callback: (uri: Uri, diagnostics: Diagnostic[], collection: DiagnosticCollection) => any, thisArg?: any): void;
  get(uri: Uri): Diagnostic[] | undefined;
  has(uri: Uri): boolean;
  dispose(): void;
}

export interface CodeAction {
  title: string;
  edit?: WorkspaceEdit;
  diagnostics?: Diagnostic[];
  command?: Command;
  kind?: CodeActionKind;
  isPreferred?: boolean;
}

export interface WorkspaceEdit {
  size: number;
  replace(uri: Uri, range: Range, newText: string): void;
  insert(uri: Uri, position: Position, newText: string): void;
  delete(uri: Uri, range: Range): void;
  has(uri: Uri): boolean;
  set(uri: Uri, edits: TextEdit[]): void;
  get(uri: Uri): TextEdit[];
  entries(): [Uri, TextEdit[]][];
}

export interface TextEdit {
  range: Range;
  newText: string;
  newEol?: EndOfLine;
}

// Terminal types
export interface Terminal {
  name: string;
  processId: Thenable<number | undefined>;
  creationOptions: Readonly<TerminalOptions | ExtensionTerminalOptions>;
  exitStatus: TerminalExitStatus | undefined;
  sendText(text: string, addNewLine?: boolean): void;
  show(preserveFocus?: boolean): void;
  hide(): void;
  dispose(): void;
}

export interface TerminalOptions {
  name?: string;
  shellPath?: string;
  shellArgs?: string[] | string;
  cwd?: string | Uri;
  env?: { [key: string]: string | null };
}

export interface ExtensionTerminalOptions {
  name: string;
  pty: any;
}

export interface TerminalExitStatus {
  readonly code: number | undefined;
}

// Extension types
export interface Extension<T> {
  readonly id: string;
  readonly extensionUri: Uri;
  readonly extensionPath: string;
  readonly isActive: boolean;
  readonly packageJSON: any;
  readonly exports: T;
  activate(): Thenable<T>;
}

export interface ExtensionContext {
  subscriptions: Disposable[];
  workspaceState: Memento;
  globalState: Memento;
  extensionUri: Uri;
  extensionPath: string;
  asAbsolutePath(relativePath: string): string;
  storagePath: string | undefined;
  globalStoragePath: string;
  logPath: string;
}

export interface Memento {
  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue: T): T;
  update(key: string, value: any): Thenable<void>;
}

// Output channel types
export interface OutputChannel {
  name: string;
  append(value: string): void;
  appendLine(value: string): void;
  clear(): void;
  show(preserveFocus?: boolean): void;
  hide(): void;
  dispose(): void;
}

// Status bar types
export interface StatusBarItem {
  alignment: StatusBarAlignment;
  priority: number;
  text: string;
  tooltip: string | undefined;
  color: string | undefined;
  backgroundColor: ThemeColor | undefined;
  command: string | Command | undefined;
  accessibilityInformation: AccessibilityInformation | undefined;
  show(): void;
  hide(): void;
  dispose(): void;
}

// Tree view types
export interface TreeDataProvider<T> {
  onDidChangeTreeData?: Event<T | undefined | null>;
  getTreeItem(element: T): TreeItem | Thenable<TreeItem>;
  getChildren(element?: T): ProviderResult<T[]>;
  getParent?(element: T): ProviderResult<T>;
}

export interface TreeItem {
  label: string;
  id?: string;
  iconPath?: string | Uri | { light: string | Uri; dark: string | Uri };
  description?: string | boolean;
  tooltip?: string;
  command?: Command;
  contextValue?: string;
  collapsibleState?: TreeItemCollapsibleState;
}

export interface TreeView<T> {
  readonly onDidExpandElement: Event<any>;
  readonly onDidCollapseElement: Event<any>;
  readonly selection: T[];
  readonly onDidChangeSelection: Event<any>;
  readonly visible: boolean;
  readonly onDidChangeVisibility: Event<any>;
  reveal(element: T, options?: { select?: boolean; focus?: boolean; expand?: boolean | number }): Thenable<void>;
  dispose(): void;
}

// Webview types
export interface WebviewPanel {
  readonly viewType: string;
  readonly title: string;
  readonly iconPath?: Uri | { light: Uri; dark: Uri };
  readonly webview: Webview;
  readonly options: WebviewPanelOptions;
  readonly viewColumn?: ViewColumn;
  readonly active: boolean;
  readonly visible: boolean;
  readonly onDidChangeViewState: Event<any>;
  readonly onDidDispose: Event<void>;
  reveal(viewColumn?: ViewColumn, preserveFocus?: boolean): void;
  dispose(): void;
}

export interface Webview {
  options: WebviewOptions;
  html: string;
  readonly onDidReceiveMessage: Event<any>;
  postMessage(message: any): Thenable<boolean>;
  asWebviewUri(localResource: Uri): Uri;
  readonly cspSource: string;
}

export interface WebviewOptions {
  readonly enableScripts?: boolean;
  readonly enableCommandUris?: boolean;
  readonly localResourceRoots?: ReadonlyArray<Uri>;
  readonly portMapping?: ReadonlyArray<WebviewPortMapping>;
}

export interface WebviewPanelOptions {
  readonly enableFindWidget?: boolean;
  readonly retainContextWhenHidden?: boolean;
}

export interface WebviewPortMapping {
  readonly webviewPort: number;
  readonly extensionHostPort: number;
}

// Progress types
export interface Progress<T> {
  report(value: T): void;
}

export interface ProgressOptions {
  location: ProgressLocation;
  title?: string;
  cancellable?: boolean;
}

// Message types
export interface MessageItem {
  title: string;
  isCloseAffordance?: boolean;
}

export interface MessageOptions {
  modal?: boolean;
}

// Quick pick types
export interface QuickPickItem {
  label: string;
  description?: string;
  detail?: string;
  picked?: boolean;
  alwaysShow?: boolean;
}

export interface InputBoxOptions {
  value?: string;
  valueSelection?: [number, number];
  prompt?: string;
  placeHolder?: string;
  password?: boolean;
  ignoreFocusOut?: boolean;
  validateInput?(value: string): string | undefined | null | Thenable<string | undefined | null>;
}

// Dialog types
export interface OpenDialogOptions {
  defaultUri?: Uri;
  openLabel?: string;
  canSelectFiles?: boolean;
  canSelectFolders?: boolean;
  canSelectMany?: boolean;
  filters?: { [name: string]: string[] };
}

export interface SaveDialogOptions {
  defaultUri?: Uri;
  saveLabel?: string;
  filters?: { [name: string]: string[] };
}

// Command types
export interface Command {
  title: string;
  command: string;
  tooltip?: string;
  arguments?: any[];
}

// File system types
export interface FileStat {
  type: FileType;
  ctime: number;
  mtime: number;
  size: number;
}

export interface FileSystemWatcher extends Disposable {
  readonly onDidCreate: Event<Uri>;
  readonly onDidChange: Event<Uri>;
  readonly onDidDelete: Event<Uri>;
}

// Enums
export enum FileType {
  Unknown = 0,
  File = 1,
  Directory = 2,
  SymbolicLink = 64
}

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3
}

export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2
}

export enum CompletionItemKind {
  Text = 0,
  Method = 1,
  Function = 2,
  Constructor = 3,
  Field = 4,
  Variable = 5,
  Class = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Unit = 10,
  Value = 11,
  Enum = 12,
  Keyword = 13,
  Snippet = 14,
  Color = 15,
  File = 16,
  Reference = 17,
  Folder = 18,
  EnumMember = 19,
  Constant = 20,
  Struct = 21,
  Event = 22,
  Operator = 23,
  TypeParameter = 24
}

export enum CompletionTriggerKind {
  Invoke = 0,
  TriggerCharacter = 1,
  TriggerForIncompleteCompletions = 2
}

export enum CodeActionKind {
  Empty = '',
  QuickFix = 'quickfix',
  Refactor = 'refactor',
  RefactorExtract = 'refactor.extract',
  RefactorInline = 'refactor.inline',
  RefactorRewrite = 'refactor.rewrite',
  Source = 'source',
  SourceOrganizeImports = 'source.organizeImports'
}

export enum TextEditorCursorStyle {
  Line = 1,
  Block = 2,
  Underline = 3,
  LineThin = 4,
  BlockOutline = 5,
  UnderlineThin = 6
}

export enum TextEditorLineNumbersStyle {
  Off = 0,
  On = 1,
  Relative = 2
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

export enum ViewColumn {
  Active = -1,
  Beside = -2,
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9
}

export enum StatusBarAlignment {
  Left = 1,
  Right = 2
}

export enum EndOfLine {
  LF = 1,
  CRLF = 2
}

export enum ProgressLocation {
  SourceControl = 1,
  Window = 10,
  Notification = 15
}

export enum TreeItemCollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2
}

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3
}

// Type aliases
export type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;
export type GlobPattern = string | RelativePattern;
export type DocumentSelector = string | DocumentFilter | (string | DocumentFilter)[];
export type DefinitionProvider = { provideDefinition(document: TextDocument, position: Position, token: CancellationToken): ProviderResult<Definition | Definition[]> };

export interface RelativePattern {
  base: string;
  pattern: string;
}

export interface DocumentFilter {
  language?: string;
  scheme?: string;
  pattern?: GlobPattern;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
  onCancellationRequested: Event<any>;
}

export class CancellationTokenSource {
  token: CancellationToken;
  cancel(): void;
  dispose(): void;
}

export interface AccessibilityInformation {
  label: string;
  role?: string;
}

export interface ThemeColor {
  id: string;
}

export interface TextDocumentWillSaveEvent {
  document: TextDocument;
  reason: TextDocumentSaveReason;
  waitUntil(thenable: Thenable<TextEdit[]>): void;
  waitUntil(thenable: Thenable<any>): void;
}

export enum TextDocumentSaveReason {
  Manual = 1,
  AfterDelay = 2,
  FocusOut = 3
}

export class SnippetString {
  value: string;
  
  constructor(value?: string) {
    this.value = value || '';
  }
  
  appendText(string: string): SnippetString {
    this.value += string;
    return this;
  }
  
  appendTabstop(number?: number): SnippetString {
    this.value += `$${number || 0}`;
    return this;
  }
  
  appendPlaceholder(value: string | ((snippet: SnippetString) => any), number?: number): SnippetString {
    if (typeof value === 'string') {
      this.value += `\${${number || 0}:${value}}`;
    }
    return this;
  }
  
  appendChoice(values: string[], number?: number): SnippetString {
    this.value += `\${${number || 0}|${values.join(',')}|}`;
    return this;
  }
  
  appendVariable(name: string, defaultValue?: string | ((snippet: SnippetString) => any)): SnippetString {
    if (typeof defaultValue === 'string') {
      this.value += `\${${name}:${defaultValue}}`;
    } else {
      this.value += `$${name}`;
    }
    return this;
  }
}

export interface TextEditorDecorationType {
  key: string;
  dispose(): void;
}

export interface DecorationOptions {
  range: Range;
  hoverMessage?: string;
  renderOptions?: any;
}