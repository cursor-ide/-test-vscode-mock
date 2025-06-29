import { EventEmitter } from './EventEmitter';
import type { Event, Disposable, Uri, WorkspaceFolder } from './types';

export interface DebugSession {
  id: string;
  type: string;
  name: string;
  workspaceFolder: WorkspaceFolder | undefined;
  configuration: DebugConfiguration;
  customRequest(command: string, args?: any): Thenable<any>;
  getDebugProtocolBreakpoint(breakpoint: Breakpoint): Thenable<DebugProtocolBreakpoint | undefined>;
}

export interface DebugConfiguration {
  type: string;
  name: string;
  request: string;
  [key: string]: any;
}

export interface DebugConfigurationProvider {
  provideDebugConfigurations?(folder: WorkspaceFolder | undefined, token?: CancellationToken): ProviderResult<DebugConfiguration[]>;
  resolveDebugConfiguration?(folder: WorkspaceFolder | undefined, debugConfiguration: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration>;
  resolveDebugConfigurationWithSubstitutedVariables?(folder: WorkspaceFolder | undefined, debugConfiguration: DebugConfiguration, token?: CancellationToken): ProviderResult<DebugConfiguration>;
}

export interface DebugAdapterDescriptorFactory {
  createDebugAdapterDescriptor(session: DebugSession, executable: DebugAdapterExecutable | undefined): ProviderResult<DebugAdapterDescriptor>;
}

export interface DebugAdapterDescriptor {
  // Base interface
}

export class DebugAdapterExecutable implements DebugAdapterDescriptor {
  constructor(
    public readonly command: string,
    public readonly args?: string[],
    public readonly options?: DebugAdapterExecutableOptions
  ) {}
}

export class DebugAdapterServer implements DebugAdapterDescriptor {
  constructor(
    public readonly port: number,
    public readonly host?: string
  ) {}
}

export class DebugAdapterNamedPipeServer implements DebugAdapterDescriptor {
  constructor(public readonly path: string) {}
}

export class DebugAdapterInlineImplementation implements DebugAdapterDescriptor {
  constructor(public readonly implementation: any) {}
}

export interface DebugAdapterExecutableOptions {
  env?: { [key: string]: string };
  cwd?: string;
}

export interface Breakpoint {
  readonly id: string;
  readonly enabled: boolean;
  readonly condition?: string;
  readonly hitCondition?: string;
  readonly logMessage?: string;
}

export class SourceBreakpoint extends Breakpoint {
  constructor(
    public readonly location: Location,
    enabled?: boolean,
    condition?: string,
    hitCondition?: string,
    logMessage?: string
  ) {
    super();
  }
}

export class FunctionBreakpoint extends Breakpoint {
  constructor(
    public readonly functionName: string,
    enabled?: boolean,
    condition?: string,
    hitCondition?: string,
    logMessage?: string
  ) {
    super();
  }
}

export interface DebugProtocolBreakpoint {
  // Debug Adapter Protocol breakpoint
}

export interface DebugConsole {
  append(value: string): void;
  appendLine(value: string): void;
}

export interface Location {
  uri: Uri;
  range: Range;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface Position {
  line: number;
  character: number;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
}

type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

// Event emitters
const onDidStartDebugSessionEmitter = new EventEmitter<DebugSession>();
const onDidTerminateDebugSessionEmitter = new EventEmitter<DebugSession>();
const onDidChangeActiveDebugSessionEmitter = new EventEmitter<DebugSession | undefined>();
const onDidReceiveDebugSessionCustomEventEmitter = new EventEmitter<DebugSessionCustomEvent>();
const onDidChangeBreakpointsEmitter = new EventEmitter<BreakpointsChangeEvent>();

export interface DebugSessionCustomEvent {
  session: DebugSession;
  event: string;
  body?: any;
}

export interface BreakpointsChangeEvent {
  added: readonly Breakpoint[];
  removed: readonly Breakpoint[];
  changed: readonly Breakpoint[];
}

// Mock debug console
const mockDebugConsole: DebugConsole = {
  append: (value: string) => console.log(`[DebugConsole] ${value}`),
  appendLine: (value: string) => console.log(`[DebugConsole] ${value}`)
};

export const debug = {
  activeDebugSession: undefined as DebugSession | undefined,
  activeDebugConsole: mockDebugConsole,
  breakpoints: [] as Breakpoint[],
  
  // Events
  onDidStartDebugSession: onDidStartDebugSessionEmitter.event,
  onDidTerminateDebugSession: onDidTerminateDebugSessionEmitter.event,
  onDidChangeActiveDebugSession: onDidChangeActiveDebugSessionEmitter.event,
  onDidReceiveDebugSessionCustomEvent: onDidReceiveDebugSessionCustomEventEmitter.event,
  onDidChangeBreakpoints: onDidChangeBreakpointsEmitter.event,
  
  startDebugging: async (folder: WorkspaceFolder | undefined, nameOrConfig: string | DebugConfiguration, parentSessionOrOptions?: DebugSession | DebugSessionOptions): Promise<boolean> => {
    const config = typeof nameOrConfig === 'string' 
      ? { type: 'mock', name: nameOrConfig, request: 'launch' } 
      : nameOrConfig;
    
    console.log(`[Debug] Starting session: ${config.name}`);
    
    const session: DebugSession = {
      id: `debug-session-${Date.now()}`,
      type: config.type,
      name: config.name,
      workspaceFolder: folder,
      configuration: config,
      customRequest: async (command: string, args?: any) => {
        console.log(`[Debug] Custom request: ${command}`, args);
        return {};
      },
      getDebugProtocolBreakpoint: async (breakpoint: Breakpoint) => {
        return undefined;
      }
    };
    
    debug.activeDebugSession = session;
    onDidStartDebugSessionEmitter.fire(session);
    onDidChangeActiveDebugSessionEmitter.fire(session);
    
    return true;
  },
  
  stopDebugging: async (session?: DebugSession): Promise<void> => {
    const targetSession = session || debug.activeDebugSession;
    if (targetSession) {
      console.log(`[Debug] Stopping session: ${targetSession.name}`);
      onDidTerminateDebugSessionEmitter.fire(targetSession);
      if (debug.activeDebugSession === targetSession) {
        debug.activeDebugSession = undefined;
        onDidChangeActiveDebugSessionEmitter.fire(undefined);
      }
    }
  },
  
  registerDebugConfigurationProvider: (debugType: string, provider: DebugConfigurationProvider, triggerKind?: DebugConfigurationProviderTriggerKind): Disposable => {
    console.log(`[Debug] Registered configuration provider for ${debugType}`);
    return {
      dispose: () => console.log(`[Debug] Unregistered configuration provider for ${debugType}`)
    };
  },
  
  registerDebugAdapterDescriptorFactory: (debugType: string, factory: DebugAdapterDescriptorFactory): Disposable => {
    console.log(`[Debug] Registered adapter descriptor factory for ${debugType}`);
    return {
      dispose: () => console.log(`[Debug] Unregistered adapter descriptor factory for ${debugType}`)
    };
  },
  
  addBreakpoints: (breakpoints: readonly Breakpoint[]): void => {
    debug.breakpoints.push(...breakpoints);
    onDidChangeBreakpointsEmitter.fire({
      added: breakpoints,
      removed: [],
      changed: []
    });
    console.log(`[Debug] Added ${breakpoints.length} breakpoints`);
  },
  
  removeBreakpoints: (breakpoints: readonly Breakpoint[]): void => {
    const toRemove = new Set(breakpoints);
    debug.breakpoints = debug.breakpoints.filter(bp => !toRemove.has(bp));
    onDidChangeBreakpointsEmitter.fire({
      added: [],
      removed: breakpoints,
      changed: []
    });
    console.log(`[Debug] Removed ${breakpoints.length} breakpoints`);
  },
  
  asDebugSourceUri: (source: DebugProtocolSource, session?: DebugSession): Uri => {
    const sessionId = session?.id || 'unknown';
    return Uri.parse(`debug:${sessionId}/${source.name || 'source'}`);
  }
};

export interface DebugSessionOptions {
  parentSession?: DebugSession;
  lifecycleManagedByParent?: boolean;
  consoleMode?: DebugConsoleMode;
  noDebug?: boolean;
  compact?: boolean;
}

export interface DebugProtocolSource {
  name?: string;
  path?: string;
  sourceReference?: number;
}

export enum DebugConsoleMode {
  Separate = 0,
  MergeWithParent = 1
}

export enum DebugConfigurationProviderTriggerKind {
  Initial = 1,
  Dynamic = 2
}