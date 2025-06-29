import { EventEmitter } from './EventEmitter';
import { Uri } from './Uri';
import type { Event, TextDocument, WorkspaceFolder, WorkspaceConfiguration, ConfigurationTarget, FileSystemWatcher, GlobPattern, TextDocumentSaveReason, TextDocumentWillSaveEvent } from './types';

const onDidOpenTextDocumentEmitter = new EventEmitter<TextDocument>();
const onDidCloseTextDocumentEmitter = new EventEmitter<TextDocument>();
const onDidChangeTextDocumentEmitter = new EventEmitter<any>();
const onDidSaveTextDocumentEmitter = new EventEmitter<TextDocument>();
const onWillSaveTextDocumentEmitter = new EventEmitter<TextDocumentWillSaveEvent>();
const onDidChangeWorkspaceFoldersEmitter = new EventEmitter<any>();
const onDidChangeConfigurationEmitter = new EventEmitter<any>();

class MockConfiguration implements WorkspaceConfiguration {
  private config = new Map<string, any>();
  
  get<T>(section: string, defaultValue?: T): T {
    return this.config.get(section) ?? defaultValue;
  }
  
  has(section: string): boolean {
    return this.config.has(section);
  }
  
  inspect<T>(section: string): any {
    return {
      key: section,
      defaultValue: undefined,
      globalValue: this.config.get(section),
      workspaceValue: undefined,
      workspaceFolderValue: undefined
    };
  }
  
  update(section: string, value: any, configurationTarget?: ConfigurationTarget | boolean): Thenable<void> {
    this.config.set(section, value);
    console.log(`[Config] Updated ${section} = ${JSON.stringify(value)}`);
    return Promise.resolve();
  }
}

export const workspace = {
  workspaceFolders: [] as WorkspaceFolder[],
  name: 'Mock Workspace',
  textDocuments: [] as TextDocument[],
  
  // Events
  onDidOpenTextDocument: onDidOpenTextDocumentEmitter.event,
  onDidCloseTextDocument: onDidCloseTextDocumentEmitter.event,
  onDidChangeTextDocument: onDidChangeTextDocumentEmitter.event,
  onDidSaveTextDocument: onDidSaveTextDocumentEmitter.event,
  onWillSaveTextDocument: onWillSaveTextDocumentEmitter.event,
  onDidChangeWorkspaceFolders: onDidChangeWorkspaceFoldersEmitter.event,
  onDidChangeConfiguration: onDidChangeConfigurationEmitter.event,
  
  getConfiguration(section?: string, scope?: any): WorkspaceConfiguration {
    return new MockConfiguration();
  },
  
  openTextDocument: async (uriOrPath: Uri | string): Promise<TextDocument> => {
    const path = typeof uriOrPath === 'string' ? uriOrPath : uriOrPath.toString();
    const doc: TextDocument = {
      uri: typeof uriOrPath === 'string' ? Uri.file(uriOrPath) : uriOrPath,
      fileName: path,
      languageId: 'plaintext',
      version: 1,
      isDirty: false,
      isClosed: false,
      save: async () => true,
      eol: 1,
      lineCount: 0,
      lineAt: (line: number) => ({ text: '', range: null as any }),
      offsetAt: (position: any) => 0,
      positionAt: (offset: number) => ({ line: 0, character: 0 }),
      getText: (range?: any) => '',
      getWordRangeAtPosition: (position: any) => undefined,
      validateRange: (range: any) => range,
      validatePosition: (position: any) => position
    };
    workspace.textDocuments.push(doc);
    onDidOpenTextDocumentEmitter.fire(doc);
    return doc;
  },
  
  saveAll: async (includeUntitled?: boolean): Promise<boolean> => {
    console.log(`[Workspace] Save all documents ${includeUntitled ? 'including untitled' : ''}`);
    return true;
  },
  
  applyEdit: async (edit: any): Promise<boolean> => {
    console.log(`[Workspace] Apply edit`, edit);
    return true;
  },
  
  createFileSystemWatcher(globPattern: GlobPattern, ignoreCreateEvents?: boolean, ignoreChangeEvents?: boolean, ignoreDeleteEvents?: boolean): FileSystemWatcher {
    console.log(`[Workspace] Created file system watcher for ${globPattern}`);
    return {
      onDidCreate: new EventEmitter<Uri>().event,
      onDidChange: new EventEmitter<Uri>().event,
      onDidDelete: new EventEmitter<Uri>().event,
      dispose: () => {}
    };
  },
  
  findFiles(include: GlobPattern, exclude?: GlobPattern, maxResults?: number, token?: any): Thenable<Uri[]> {
    console.log(`[Workspace] Find files: ${include}`);
    return Promise.resolve([]);
  },
  
  fs: {
    stat: async (uri: Uri) => ({ type: 1, ctime: 0, mtime: 0, size: 0 }),
    readDirectory: async (uri: Uri) => [],
    createDirectory: async (uri: Uri) => {},
    readFile: async (uri: Uri) => new Uint8Array(),
    writeFile: async (uri: Uri, content: Uint8Array) => {},
    delete: async (uri: Uri, options?: { recursive?: boolean }) => {},
    rename: async (oldUri: Uri, newUri: Uri, options?: { overwrite?: boolean }) => {},
    copy: async (source: Uri, destination: Uri, options?: { overwrite?: boolean }) => {}
  }
};