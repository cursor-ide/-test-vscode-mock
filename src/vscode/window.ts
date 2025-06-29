import { EventEmitter } from './EventEmitter';
import { mockSystem } from './core/MockSystem';
import { Uri } from './Uri';
import type { 
  TextEditor, OutputChannel, Terminal, StatusBarItem, TreeView, 
  WebviewPanel, QuickPickItem, InputBoxOptions, MessageItem,
  Progress, ProgressOptions, Disposable
} from './types';

interface WindowState {
  activeTextEditor: TextEditor | undefined;
  visibleTextEditors: TextEditor[];
  terminals: Terminal[];
  activeTerminal: Terminal | undefined;
  statusBarItems: StatusBarItem[];
  outputChannels: Map<string, OutputChannel>;
  treeViews: Map<string, TreeView<any>>;
  webviewPanels: Map<string, WebviewPanel>;
  focused: boolean;
}

const initialState: WindowState = {
  activeTextEditor: undefined,
  visibleTextEditors: [],
  terminals: [],
  activeTerminal: undefined,
  statusBarItems: [],
  outputChannels: new Map(),
  treeViews: new Map(),
  webviewPanels: new Map(),
  focused: true
};

const windowState = mockSystem.createStateManager('window', initialState);

// Event emitters
const onDidChangeActiveTextEditorEmitter = new EventEmitter<TextEditor | undefined>();
const onDidChangeVisibleTextEditorsEmitter = new EventEmitter<readonly TextEditor[]>();
const onDidChangeWindowStateEmitter = new EventEmitter<{ focused: boolean }>();
const onDidOpenTerminalEmitter = new EventEmitter<Terminal>();
const onDidCloseTerminalEmitter = new EventEmitter<Terminal>();
const onDidChangeActiveTerminalEmitter = new EventEmitter<Terminal | undefined>();

// Subscribe to state changes
windowState.subscribe((state, prevState) => {
  if (state.activeTextEditor !== prevState.activeTextEditor) {
    onDidChangeActiveTextEditorEmitter.fire(state.activeTextEditor);
  }
  if (state.visibleTextEditors !== prevState.visibleTextEditors) {
    onDidChangeVisibleTextEditorsEmitter.fire(state.visibleTextEditors);
  }
  if (state.focused !== prevState.focused) {
    onDidChangeWindowStateEmitter.fire({ focused: state.focused });
  }
  if (state.activeTerminal !== prevState.activeTerminal) {
    onDidChangeActiveTerminalEmitter.fire(state.activeTerminal);
  }
});

export const window = {
  // State getters
  get activeTextEditor() { return windowState.current.activeTextEditor; },
  get visibleTextEditors() { return [...windowState.current.visibleTextEditors]; },
  get terminals() { return [...windowState.current.terminals]; },
  get activeTerminal() { return windowState.current.activeTerminal; },
  get state() { return { focused: windowState.current.focused }; },

  // Events
  onDidChangeActiveTextEditor: onDidChangeActiveTextEditorEmitter.event,
  onDidChangeVisibleTextEditors: onDidChangeVisibleTextEditorsEmitter.event,
  onDidChangeWindowState: onDidChangeWindowStateEmitter.event,
  onDidOpenTerminal: onDidOpenTerminalEmitter.event,
  onDidCloseTerminal: onDidCloseTerminalEmitter.event,
  onDidChangeActiveTerminal: onDidChangeActiveTerminalEmitter.event,

  // Methods
  showTextDocument: async (document: any, column?: number, preserveFocus?: boolean) => {
    return mockSystem.mockCall('window', 'showTextDocument', async () => {
      const editor: TextEditor = {
        document,
        selection: {
          anchor: { line: 0, character: 0 },
          active: { line: 0, character: 0 },
          start: { line: 0, character: 0 },
          end: { line: 0, character: 0 },
          isEmpty: true,
          isSingleLine: true,
          isReversed: false
        },
        selections: [],
        visibleRanges: [],
        options: {},
        viewColumn: column,
        edit: async (callback: any) => true,
        insertSnippet: async (snippet: any) => true,
        setDecorations: () => {},
        revealRange: () => {},
        show: () => {},
        hide: () => {}
      };

      windowState.update(state => ({
        activeTextEditor: editor,
        visibleTextEditors: [...state.visibleTextEditors, editor]
      }));

      return editor;
    }, document, column, preserveFocus);
  },

  createOutputChannel: (name: string, languageId?: string): OutputChannel => {
    return mockSystem.mockCall('window', 'createOutputChannel', () => {
      const channel: OutputChannel = {
        name,
        append: (value: string) => {
          mockSystem.mockCall('outputChannel', 'append', () => {
            console.log(`[${name}] ${value}`);
          }, value);
        },
        appendLine: (value: string) => {
          mockSystem.mockCall('outputChannel', 'appendLine', () => {
            console.log(`[${name}] ${value}`);
          }, value);
        },
        clear: () => {
          mockSystem.mockCall('outputChannel', 'clear', () => {
            console.log(`[${name}] Cleared`);
          });
        },
        show: (preserveFocus?: boolean) => {
          mockSystem.mockCall('outputChannel', 'show', () => {
            console.log(`[${name}] Show${preserveFocus ? ' (preserve focus)' : ''}`);
          }, preserveFocus);
        },
        hide: () => {
          mockSystem.mockCall('outputChannel', 'hide', () => {
            console.log(`[${name}] Hide`);
          });
        },
        dispose: () => {
          windowState.update(state => {
            const channels = new Map(state.outputChannels);
            channels.delete(name);
            return { outputChannels: channels };
          });
        }
      };

      windowState.update(state => {
        const channels = new Map(state.outputChannels);
        channels.set(name, channel);
        return { outputChannels: channels };
      });

      return channel;
    }, name, languageId);
  },

  createTerminal: (options?: any): Terminal => {
    return mockSystem.mockCall('window', 'createTerminal', () => {
      const name = typeof options === 'string' ? options : options?.name || `Terminal ${windowState.current.terminals.length + 1}`;
      
      const terminal: Terminal = {
        name,
        processId: Promise.resolve(process.pid + Math.floor(Math.random() * 1000)),
        creationOptions: options,
        exitStatus: undefined,
        state: { isInteractedWith: false },
        sendText: (text: string, addNewLine = true) => {
          mockSystem.mockCall('terminal', 'sendText', () => {
            console.log(`[Terminal:${name}] ${text}${addNewLine ? '\n' : ''}`);
          }, text, addNewLine);
        },
        show: (preserveFocus?: boolean) => {
          mockSystem.mockCall('terminal', 'show', () => {
            if (!preserveFocus) {
              windowState.update(state => ({ activeTerminal: terminal }));
            }
          }, preserveFocus);
        },
        hide: () => {
          mockSystem.mockCall('terminal', 'hide', () => {
            console.log(`[Terminal:${name}] Hidden`);
          });
        },
        dispose: () => {
          windowState.update(state => ({
            terminals: state.terminals.filter(t => t !== terminal),
            activeTerminal: state.activeTerminal === terminal ? undefined : state.activeTerminal
          }));
          onDidCloseTerminalEmitter.fire(terminal);
        }
      };

      windowState.update(state => ({
        terminals: [...state.terminals, terminal],
        activeTerminal: terminal
      }));
      
      onDidOpenTerminalEmitter.fire(terminal);
      return terminal;
    }, options);
  },

  showInformationMessage: async <T extends MessageItem>(message: string, ...items: T[]): Promise<T | undefined> => {
    return mockSystem.mockCall('window', 'showInformationMessage', async () => {
      // Simulate user selection with optional delay
      if (items.length > 0) {
        await Bun.sleep(100); // Simulate user thinking time
        return items[0];
      }
      return undefined;
    }, message, ...items);
  },

  showErrorMessage: async <T extends MessageItem>(message: string, ...items: T[]): Promise<T | undefined> => {
    return mockSystem.mockCall('window', 'showErrorMessage', async () => {
      console.error(`[Error Dialog] ${message}`);
      if (items.length > 0) {
        await Bun.sleep(100);
        return items[0];
      }
      return undefined;
    }, message, ...items);
  },

  showWarningMessage: async <T extends MessageItem>(message: string, ...items: T[]): Promise<T | undefined> => {
    return mockSystem.mockCall('window', 'showWarningMessage', async () => {
      console.warn(`[Warning Dialog] ${message}`);
      if (items.length > 0) {
        await Bun.sleep(100);
        return items[0];
      }
      return undefined;
    }, message, ...items);
  },

  showQuickPick: async <T extends QuickPickItem>(
    items: T[] | Thenable<T[]>,
    options?: any
  ): Promise<T | undefined> => {
    return mockSystem.mockCall('window', 'showQuickPick', async () => {
      const resolvedItems = await Promise.resolve(items);
      if (resolvedItems.length > 0) {
        await Bun.sleep(150); // Simulate selection time
        // Could implement more sophisticated selection logic based on options
        return resolvedItems[0];
      }
      return undefined;
    }, items, options);
  },

  withProgress: async <R>(
    options: ProgressOptions,
    task: (progress: Progress<any>, token: any) => Thenable<R>
  ): Promise<R> => {
    return mockSystem.mockCall('window', 'withProgress', async () => {
      const progress: Progress<any> = {
        report: (value: any) => {
          console.log(`[Progress:${options.title || 'Working'}] ${JSON.stringify(value)}`);
        }
      };
      
      const token = {
        isCancellationRequested: false,
        onCancellationRequested: new EventEmitter<any>().event
      };

      // Show progress started
      progress.report({ message: 'Starting...' });
      
      try {
        const result = await task(progress, token);
        progress.report({ message: 'Complete' });
        return result;
      } catch (error) {
        progress.report({ message: 'Failed' });
        throw error;
      }
    }, options, task);
  },

  createStatusBarItem: (alignment?: any, priority?: number): StatusBarItem => {
    return mockSystem.mockCall('window', 'createStatusBarItem', () => {
      const item: StatusBarItem = {
        alignment: alignment || 0,
        priority: priority || 0,
        text: '',
        tooltip: '',
        color: undefined,
        backgroundColor: undefined,
        command: undefined,
        accessibilityInformation: undefined,
        id: `statusbar-${Date.now()}`,
        name: undefined,
        show: () => {
          windowState.update(state => ({
            statusBarItems: [...state.statusBarItems, item]
          }));
        },
        hide: () => {
          windowState.update(state => ({
            statusBarItems: state.statusBarItems.filter(i => i !== item)
          }));
        },
        dispose: () => {
          item.hide();
        }
      };
      return item;
    }, alignment, priority);
  },

  // Additional methods following the same pattern...
  registerUriHandler: (handler: any): Disposable => {
    return mockSystem.mockCall('window', 'registerUriHandler', () => {
      console.log('[Window] Registered URI handler');
      return {
        dispose: () => console.log('[Window] Unregistered URI handler')
      };
    }, handler);
  },

  registerWebviewPanelSerializer: (viewType: string, serializer: any): Disposable => {
    return mockSystem.mockCall('window', 'registerWebviewPanelSerializer', () => {
      console.log(`[Window] Registered webview serializer for ${viewType}`);
      return {
        dispose: () => console.log(`[Window] Unregistered webview serializer for ${viewType}`)
      };
    }, viewType, serializer);
  }
};