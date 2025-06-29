import { EventEmitter } from './EventEmitter';
import type { Event, Disposable, Uri, Range } from './types';

export interface NotebookController {
  id: string;
  notebookType: string;
  supportedLanguages?: string[];
  label: string;
  description?: string;
  detail?: string;
  supportsExecutionOrder?: boolean;
  createNotebookCellExecution(cell: NotebookCell): NotebookCellExecution;
  executeHandler: NotebookExecuteHandler;
  dispose(): void;
}

export interface NotebookDocument {
  uri: Uri;
  notebookType: string;
  version: number;
  isDirty: boolean;
  isUntitled: boolean;
  isClosed: boolean;
  metadata: { [key: string]: any };
  cellCount: number;
  cellAt(index: number): NotebookCell;
  getCells(range?: NotebookRange): NotebookCell[];
  save(): Thenable<boolean>;
}

export interface NotebookCell {
  index: number;
  notebook: NotebookDocument;
  kind: NotebookCellKind;
  document: TextDocument;
  metadata: { [key: string]: any };
  outputs: readonly NotebookCellOutput[];
  executionSummary?: NotebookCellExecutionSummary;
}

export interface NotebookCellOutput {
  items: readonly NotebookCellOutputItem[];
  metadata?: { [key: string]: any };
}

export interface NotebookCellOutputItem {
  mime: string;
  data: Uint8Array;
}

export interface NotebookCellExecution {
  executionOrder?: number;
  start(startTime?: number): void;
  end(success: boolean | undefined, endTime?: number): void;
  clearOutput(cell?: NotebookCell): Thenable<void>;
  replaceOutput(out: NotebookCellOutput | NotebookCellOutput[], cell?: NotebookCell): Thenable<void>;
  appendOutput(out: NotebookCellOutput | NotebookCellOutput[], cell?: NotebookCell): Thenable<void>;
  replaceOutputItems(items: NotebookCellOutputItem | NotebookCellOutputItem[], output: NotebookCellOutput): Thenable<void>;
  appendOutputItems(items: NotebookCellOutputItem | NotebookCellOutputItem[], output: NotebookCellOutput): Thenable<void>;
  token: CancellationToken;
}

export interface NotebookCellExecutionSummary {
  executionOrder?: number;
  success?: boolean;
  startTime?: number;
  endTime?: number;
}

export interface NotebookRange {
  start: number;
  end: number;
}

export interface NotebookSerializer {
  deserializeNotebook(content: Uint8Array, token: CancellationToken): NotebookData | Thenable<NotebookData>;
  serializeNotebook(data: NotebookData, token: CancellationToken): Uint8Array | Thenable<Uint8Array>;
}

export interface NotebookData {
  cells: NotebookCellData[];
  metadata?: { [key: string]: any };
}

export interface NotebookCellData {
  kind: NotebookCellKind;
  source: string;
  languageId: string;
  outputs?: NotebookCellOutput[];
  metadata?: { [key: string]: any };
  executionSummary?: NotebookCellExecutionSummary;
}

export enum NotebookCellKind {
  Markup = 1,
  Code = 2
}

export interface TextDocument {
  uri: Uri;
  fileName: string;
  getText(): string;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
  onCancellationRequested: Event<any>;
}

type NotebookExecuteHandler = (cells: NotebookCell[], notebook: NotebookDocument, controller: NotebookController) => void | Thenable<void>;

const onDidOpenNotebookDocumentEmitter = new EventEmitter<NotebookDocument>();
const onDidCloseNotebookDocumentEmitter = new EventEmitter<NotebookDocument>();
const onDidChangeNotebookDocumentEmitter = new EventEmitter<any>();

export const notebooks = {
  onDidOpenNotebookDocument: onDidOpenNotebookDocumentEmitter.event,
  onDidCloseNotebookDocument: onDidCloseNotebookDocumentEmitter.event,
  onDidChangeNotebookDocument: onDidChangeNotebookDocumentEmitter.event,
  
  createNotebookController(
    id: string,
    notebookType: string,
    label: string,
    handler?: NotebookExecuteHandler
  ): NotebookController {
    console.log(`[Notebooks] Created controller: ${id} for ${notebookType}`);
    
    const controller: NotebookController = {
      id,
      notebookType,
      label,
      createNotebookCellExecution: (cell: NotebookCell) => {
        console.log(`[Notebooks] Created cell execution for cell ${cell.index}`);
        return createNotebookCellExecution(cell);
      },
      executeHandler: handler || (() => {}),
      dispose: () => console.log(`[Notebooks] Disposed controller: ${id}`)
    };
    
    return controller;
  },
  
  registerNotebookSerializer(
    notebookType: string,
    serializer: NotebookSerializer,
    options?: { transientOutputs?: boolean; transientCellMetadata?: { [key: string]: boolean } }
  ): Disposable {
    console.log(`[Notebooks] Registered serializer for ${notebookType}`);
    return {
      dispose: () => console.log(`[Notebooks] Unregistered serializer for ${notebookType}`)
    };
  }
};

function createNotebookCellExecution(cell: NotebookCell): NotebookCellExecution {
  let executionOrder: number | undefined;
  
  return {
    executionOrder,
    start: (startTime?: number) => {
      console.log(`[NotebookExecution] Started cell ${cell.index}`);
    },
    end: (success: boolean | undefined, endTime?: number) => {
      console.log(`[NotebookExecution] Ended cell ${cell.index}, success: ${success}`);
    },
    clearOutput: async (targetCell?: NotebookCell) => {
      console.log(`[NotebookExecution] Cleared output for cell ${targetCell?.index || cell.index}`);
    },
    replaceOutput: async (out: NotebookCellOutput | NotebookCellOutput[], targetCell?: NotebookCell) => {
      console.log(`[NotebookExecution] Replaced output for cell ${targetCell?.index || cell.index}`);
    },
    appendOutput: async (out: NotebookCellOutput | NotebookCellOutput[], targetCell?: NotebookCell) => {
      console.log(`[NotebookExecution] Appended output for cell ${targetCell?.index || cell.index}`);
    },
    replaceOutputItems: async (items: NotebookCellOutputItem | NotebookCellOutputItem[], output: NotebookCellOutput) => {
      console.log(`[NotebookExecution] Replaced output items`);
    },
    appendOutputItems: async (items: NotebookCellOutputItem | NotebookCellOutputItem[], output: NotebookCellOutput) => {
      console.log(`[NotebookExecution] Appended output items`);
    },
    token: { isCancellationRequested: false, onCancellationRequested: new EventEmitter<any>().event }
  };
}