/**
 * VS Code Mock API
 * 
 * This is the main entry point for the VS Code mock system.
 * It provides a complete mock implementation of the VS Code API for testing.
 */

// Re-export all types first (for better IntelliSense)
export * from './types';
export type * from './types/index';

// Core classes and utilities
export { Uri } from './Uri';
export { EventEmitter } from './EventEmitter';
export { Position, Range, Selection } from './types/position';
export { Location } from './types/location';
export { SnippetString } from './types/snippet';
export { ThemeColor, ThemeIcon } from './types/theme';
export { MarkdownString } from './types/markdown';
export { CancellationTokenSource } from './types/cancellation';

// Namespaces - using namespace imports for cleaner API
export { window } from './namespaces/window';
export { workspace } from './namespaces/workspace';
export { commands } from './namespaces/commands';
export { languages } from './namespaces/languages';
export { env } from './namespaces/env';
export { extensions } from './namespaces/extensions';
export { debug } from './namespaces/debug';
export { tasks } from './namespaces/tasks';
export { scm } from './namespaces/scm';
export { comments } from './namespaces/comments';
export { authentication } from './namespaces/authentication';
export { tests } from './namespaces/tests';
export { notebooks } from './namespaces/notebooks';
export { l10n } from './namespaces/l10n';

// Enums - export individually for better tree-shaking
export {
  DiagnosticSeverity,
  DiagnosticTag,
  CompletionItemKind,
  CompletionTriggerKind,
  SignatureHelpTriggerKind,
  DocumentHighlightKind,
  SymbolKind,
  SymbolTag,
  CodeActionKind,
  CodeActionTriggerKind,
  TextEditorCursorStyle,
  TextEditorLineNumbersStyle,
  TextEditorRevealType,
  TextEditorSelectionChangeKind,
  DecorationRangeBehavior,
  OverviewRulerLane,
  StatusBarAlignment,
  ViewColumn,
  EndOfLine,
  ProgressLocation,
  TreeItemCollapsibleState,
  ConfigurationTarget,
  FileType,
  FilePermission,
  ExtensionKind,
  ExtensionMode,
  EnvironmentVariableMutatorType,
  UIKind,
  ColorThemeKind,
  SourceControlInputBoxValidationType,
  TaskRevealKind,
  TaskPanelKind,
  TaskScope,
  ShellQuoting,
  TaskState,
  DebugConsoleMode,
  DebugConfigurationProviderTriggerKind,
  TestRunProfileKind,
  NotebookCellKind,
  NotebookCellStatusBarAlignment,
  NotebookEditorRevealType,
  NotebookControllerAffinity,
  CommentThreadCollapsibleState,
  CommentMode,
  CommentThreadState,
  TextDocumentSaveReason,
  TextDocumentChangeReason,
  InputBoxValidationSeverity,
  QuickPickItemKind,
  TerminalLocation,
  TerminalExitReason,
  EnvironmentVariableMutatorType as TerminalEnvironmentVariableMutatorType,
  FoldingRangeKind,
  IndentAction
} from './enums';

// Version info
export const version = '1.95.0' as const;

// Type guards and utilities
export { isPosition, isRange, isSelection, isLocation } from './types/guards';