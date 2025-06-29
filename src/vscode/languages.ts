import { EventEmitter } from './EventEmitter';
import type { Disposable, DiagnosticCollection, Diagnostic, Range, Uri, CompletionItem, CompletionItemKind, TextDocument, Position, CancellationToken, CompletionContext, CompletionList, Hover, Location, Definition, SignatureHelp, CodeAction, CodeActionKind, WorkspaceEdit } from './types';

class MockDiagnosticCollection implements DiagnosticCollection {
  private diagnostics = new Map<string, Diagnostic[]>();
  
  constructor(public name: string) {}
  
  set(uri: Uri, diagnostics: Diagnostic[] | undefined): void {
    if (diagnostics) {
      this.diagnostics.set(uri.toString(), diagnostics);
    } else {
      this.diagnostics.delete(uri.toString());
    }
  }
  
  delete(uri: Uri): void {
    this.diagnostics.delete(uri.toString());
  }
  
  clear(): void {
    this.diagnostics.clear();
  }
  
  dispose(): void {
    this.clear();
  }
}

export const languages = {
  diagnosticCollections: new Map<string, DiagnosticCollection>(),
  
  createDiagnosticCollection(name: string): DiagnosticCollection {
    const collection = new MockDiagnosticCollection(name);
    this.diagnosticCollections.set(name, collection);
    return collection;
  },
  
  registerCompletionItemProvider(
    selector: any,
    provider: {
      provideCompletionItems(document: TextDocument, position: Position, token: CancellationToken, context: CompletionContext): CompletionItem[] | CompletionList | Thenable<CompletionItem[] | CompletionList | undefined>;
      resolveCompletionItem?(item: CompletionItem, token: CancellationToken): Thenable<CompletionItem>;
    },
    ...triggerCharacters: string[]
  ): Disposable {
    console.log(`[Languages] Registered completion provider for ${JSON.stringify(selector)} with triggers: ${triggerCharacters}`);
    return { dispose: () => {} };
  },
  
  registerHoverProvider(
    selector: any,
    provider: {
      provideHover(document: TextDocument, position: Position, token: CancellationToken): Hover | Thenable<Hover | undefined>;
    }
  ): Disposable {
    console.log(`[Languages] Registered hover provider for ${JSON.stringify(selector)}`);
    return { dispose: () => {} };
  },
  
  registerDefinitionProvider(
    selector: any,
    provider: {
      provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Definition | Thenable<Definition | undefined>;
    }
  ): Disposable {
    console.log(`[Languages] Registered definition provider for ${JSON.stringify(selector)}`);
    return { dispose: () => {} };
  },
  
  registerSignatureHelpProvider(
    selector: any,
    provider: {
      provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): SignatureHelp | Thenable<SignatureHelp | undefined>;
    },
    ...triggerCharacters: string[]
  ): Disposable {
    console.log(`[Languages] Registered signature help provider for ${JSON.stringify(selector)}`);
    return { dispose: () => {} };
  },
  
  registerCodeActionsProvider(
    selector: any,
    provider: {
      provideCodeActions(document: TextDocument, range: Range, context: any, token: CancellationToken): CodeAction[] | Thenable<CodeAction[]>;
    }
  ): Disposable {
    console.log(`[Languages] Registered code actions provider for ${JSON.stringify(selector)}`);
    return { dispose: () => {} };
  },
  
  getLanguages(): Thenable<string[]> {
    return Promise.resolve(['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown']);
  },
  
  setTextDocumentLanguage(document: TextDocument, languageId: string): Thenable<TextDocument> {
    console.log(`[Languages] Set document language to ${languageId}`);
    return Promise.resolve(document);
  },
  
  match(selector: any, document: TextDocument): number {
    return 1;
  }
};