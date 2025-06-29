/**
 * VS Code API Enums
 * 
 * All enum definitions are centralized here for consistency.
 * This allows for better tree-shaking and explicit imports.
 */

// Diagnostic enums
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

// Completion enums
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
  TypeParameter = 24,
  User = 25,
  Issue = 26
}

export enum CompletionItemTag {
  Deprecated = 1
}

export enum CompletionTriggerKind {
  Invoke = 0,
  TriggerCharacter = 1,
  TriggerForIncompleteCompletions = 2
}

// Symbol enums
export enum SymbolKind {
  File = 0,
  Module = 1,
  Namespace = 2,
  Package = 3,
  Class = 4,
  Method = 5,
  Property = 6,
  Field = 7,
  Constructor = 8,
  Enum = 9,
  Interface = 10,
  Function = 11,
  Variable = 12,
  Constant = 13,
  String = 14,
  Number = 15,
  Boolean = 16,
  Array = 17,
  Object = 18,
  Key = 19,
  Null = 20,
  EnumMember = 21,
  Struct = 22,
  Event = 23,
  Operator = 24,
  TypeParameter = 25
}

export enum SymbolTag {
  Deprecated = 1
}

// Editor enums
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
  Relative = 2,
  Interval = 3
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

export enum TextEditorSelectionChangeKind {
  Keyboard = 1,
  Mouse = 2,
  Command = 3
}

// View enums
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

// Document enums
export enum EndOfLine {
  LF = 1,
  CRLF = 2
}

export enum TextDocumentSaveReason {
  Manual = 1,
  AfterDelay = 2,
  FocusOut = 3
}

export enum TextDocumentChangeReason {
  Undo = 1,
  Redo = 2
}

// Workspace enums
export enum FileType {
  Unknown = 0,
  File = 1,
  Directory = 2,
  SymbolicLink = 64
}

export enum FilePermission {
  Readonly = 1
}

export enum ConfigurationTarget {
  Global = 1,
  Workspace = 2,
  WorkspaceFolder = 3
}

// Progress enums
export enum ProgressLocation {
  SourceControl = 1,
  Window = 10,
  Notification = 15
}

// Tree enums
export enum TreeItemCollapsibleState {
  None = 0,
  Collapsed = 1,
  Expanded = 2
}

export enum TreeItemCheckboxState {
  Unchecked = 0,
  Checked = 1
}

// Extension enums
export enum ExtensionKind {
  UI = 1,
  Workspace = 2
}

export enum ExtensionMode {
  Production = 1,
  Development = 2,
  Test = 3
}

// Environment enums
export enum UIKind {
  Desktop = 1,
  Web = 2
}

export enum ColorThemeKind {
  Light = 1,
  Dark = 2,
  HighContrast = 3,
  HighContrastLight = 4
}

export enum EnvironmentVariableMutatorType {
  Replace = 1,
  Append = 2,
  Prepend = 3
}

// Terminal enums
export enum TerminalLocation {
  Panel = 1,
  Editor = 2
}

export enum TerminalExitReason {
  Unknown = 0,
  Shutdown = 1,
  Process = 2,
  User = 3,
  Extension = 4
}

// Task enums
export enum TaskRevealKind {
  Always = 1,
  Silent = 2,
  Never = 3
}

export enum TaskPanelKind {
  Shared = 1,
  Dedicated = 2,
  New = 3
}

export enum TaskScope {
  Global = 1,
  Workspace = 2
}

export enum ShellQuoting {
  Escape = 1,
  Strong = 2,
  Weak = 3
}

export enum TaskState {
  Queued = 0,
  Running = 1
}

// Debug enums
export enum DebugConsoleMode {
  Separate = 0,
  MergeWithParent = 1
}

export enum DebugConfigurationProviderTriggerKind {
  Initial = 1,
  Dynamic = 2
}

// Test enums
export enum TestRunProfileKind {
  Run = 1,
  Debug = 2,
  Coverage = 3
}

// Notebook enums
export enum NotebookCellKind {
  Markup = 1,
  Code = 2
}

export enum NotebookCellStatusBarAlignment {
  Left = 1,
  Right = 2
}

export enum NotebookEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

export enum NotebookControllerAffinity {
  Default = 1,
  Preferred = 2
}

// Comment enums
export enum CommentThreadCollapsibleState {
  Collapsed = 0,
  Expanded = 1
}

export enum CommentMode {
  Editing = 0,
  Preview = 1
}

export enum CommentThreadState {
  Unresolved = 0,
  Resolved = 1
}

// Language enums
export enum SignatureHelpTriggerKind {
  Invoke = 1,
  TriggerCharacter = 2,
  ContentChange = 3
}

export enum InlineCompletionTriggerKind {
  Automatic = 0,
  Explicit = 1
}

export enum DocumentHighlightKind {
  Text = 0,
  Read = 1,
  Write = 2
}

export enum FoldingRangeKind {
  Comment = 1,
  Imports = 2,
  Region = 3
}

export enum IndentAction {
  None = 0,
  Indent = 1,
  IndentOutdent = 2,
  Outdent = 3
}

export enum CodeActionKind {
  Empty = '',
  QuickFix = 'quickfix',
  Refactor = 'refactor',
  RefactorExtract = 'refactor.extract',
  RefactorInline = 'refactor.inline',
  RefactorMove = 'refactor.move',
  RefactorRewrite = 'refactor.rewrite',
  Source = 'source',
  SourceOrganizeImports = 'source.organizeImports',
  SourceFixAll = 'source.fixAll',
  Notebook = 'notebook'
}

export enum CodeActionTriggerKind {
  Invoke = 1,
  Automatic = 2
}

// Input box enums
export enum InputBoxValidationSeverity {
  Info = 1,
  Warning = 2,
  Error = 3
}

export enum QuickPickItemKind {
  Separator = -1,
  Default = 0
}

// SCM enums
export enum SourceControlInputBoxValidationType {
  Error = 0,
  Warning = 1,
  Information = 2
}

// Decoration enums
export enum DecorationRangeBehavior {
  OpenOpen = 0,
  ClosedClosed = 1,
  OpenClosed = 2,
  ClosedOpen = 3
}

export enum OverviewRulerLane {
  Left = 1,
  Center = 2,
  Right = 4,
  Full = 7
}

// Log enums
export enum LogLevel {
  Off = 0,
  Trace = 1,
  Debug = 2,
  Info = 3,
  Warning = 4,
  Error = 5
}