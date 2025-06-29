import type { Disposable } from './types';

interface CommandRegistry {
  [command: string]: (...args: any[]) => any;
}

const registeredCommands: CommandRegistry = {};

export const commands = {
  executeCommand: async <T = unknown>(command: string, ...rest: any[]): Promise<T | undefined> => {
    console.log(`[Commands] Execute: ${command}`, rest);
    
    // Handle built-in commands
    if (command.startsWith('vscode.')) {
      return handleBuiltInCommand(command, rest) as T;
    }
    
    // Execute registered command
    if (registeredCommands[command]) {
      return registeredCommands[command](...rest) as T;
    }
    
    console.warn(`[Commands] Command not found: ${command}`);
    return undefined;
  },
  
  registerCommand: (command: string, callback: (...args: any[]) => any, thisArg?: any): Disposable => {
    console.log(`[Commands] Register: ${command}`);
    registeredCommands[command] = thisArg ? callback.bind(thisArg) : callback;
    
    return {
      dispose: () => {
        delete registeredCommands[command];
        console.log(`[Commands] Unregister: ${command}`);
      }
    };
  },
  
  registerTextEditorCommand: (command: string, callback: (textEditor: any, edit: any, ...args: any[]) => void, thisArg?: any): Disposable => {
    console.log(`[Commands] Register text editor command: ${command}`);
    return commands.registerCommand(command, (...args) => {
      // Mock text editor and edit
      const textEditor = { document: { uri: { path: 'mock.ts' } } };
      const edit = { replace: () => {}, insert: () => {}, delete: () => {} };
      return callback.call(thisArg, textEditor, edit, ...args);
    });
  },
  
  getCommands: async (filterInternal?: boolean): Promise<string[]> => {
    const internal = Object.keys(registeredCommands);
    const builtIn = [
      'vscode.open',
      'vscode.openFolder',
      'vscode.diff',
      'vscode.setEditorLayout',
      'workbench.action.closeActiveEditor',
      'workbench.action.nextEditor',
      'workbench.action.previousEditor',
      'editor.action.formatDocument',
      'editor.action.formatSelection'
    ];
    
    return filterInternal ? internal : [...internal, ...builtIn];
  }
};

function handleBuiltInCommand(command: string, args: any[]): any {
  switch (command) {
    case 'vscode.open':
      console.log(`[Commands] Opening: ${args[0]}`);
      return true;
    case 'vscode.diff':
      console.log(`[Commands] Diff: ${args[0]} <-> ${args[1]}`);
      return true;
    case 'vscode.setEditorLayout':
      console.log(`[Commands] Set editor layout:`, args[0]);
      return true;
    default:
      return undefined;
  }
}