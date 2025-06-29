import { EventEmitter } from './EventEmitter';
import type { Event, Disposable, Uri, Range, Position } from './types';

export interface TestController {
  id: string;
  label: string;
  items: TestItemCollection;
  createRunProfile(label: string, kind: TestRunProfileKind, runHandler: TestRunHandler, isDefault?: boolean): TestRunProfile;
  createTestRun(request: TestRunRequest, name?: string, persist?: boolean): TestRun;
  dispose(): void;
}

export interface TestItemCollection {
  size: number;
  replace(items: readonly TestItem[]): void;
  forEach(callback: (item: TestItem, collection: TestItemCollection) => unknown): void;
  add(item: TestItem): void;
  delete(itemId: string): void;
  get(itemId: string): TestItem | undefined;
}

export interface TestItem {
  id: string;
  uri?: Uri;
  label: string;
  children: TestItemCollection;
  parent?: TestItem;
  tags: readonly TestTag[];
  canResolveChildren: boolean;
  busy: boolean;
  range?: Range;
  error?: string | Error;
}

export interface TestRunProfile {
  label: string;
  kind: TestRunProfileKind;
  isDefault: boolean;
  tag?: TestTag;
  configureHandler?: () => void;
  dispose(): void;
}

export interface TestRunRequest {
  include?: TestItem[];
  exclude?: TestItem[];
  profile?: TestRunProfile;
}

export interface TestRun {
  name?: string;
  token: CancellationToken;
  isPersisted: boolean;
  enqueued(test: TestItem): void;
  started(test: TestItem): void;
  skipped(test: TestItem): void;
  failed(test: TestItem, message: TestMessage | readonly TestMessage[], duration?: number): void;
  errored(test: TestItem, message: TestMessage | readonly TestMessage[], duration?: number): void;
  passed(test: TestItem, duration?: number): void;
  appendOutput(output: string, location?: Location, test?: TestItem): void;
  end(): void;
}

export interface TestMessage {
  message: string | MarkdownString;
  expectedOutput?: string;
  actualOutput?: string;
  location?: Location;
}

export interface TestTag {
  id: string;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
  onCancellationRequested: Event<any>;
}

export interface Location {
  uri: Uri;
  range: Range;
}

export interface MarkdownString {
  value: string;
  isTrusted?: boolean;
}

export enum TestRunProfileKind {
  Run = 1,
  Debug = 2,
  Coverage = 3
}

type TestRunHandler = (request: TestRunRequest, token: CancellationToken) => void | Thenable<void>;

const onDidCreateTestControllerEmitter = new EventEmitter<TestController>();

export const tests = {
  onDidCreateTestController: onDidCreateTestControllerEmitter.event,
  
  createTestController(id: string, label: string): TestController {
    const controller: TestController = {
      id,
      label,
      items: createTestItemCollection(),
      createRunProfile: (label: string, kind: TestRunProfileKind, runHandler: TestRunHandler, isDefault?: boolean) => {
        console.log(`[Tests] Created run profile: ${label}`);
        return {
          label,
          kind,
          isDefault: isDefault ?? false,
          dispose: () => console.log(`[Tests] Disposed run profile: ${label}`)
        };
      },
      createTestRun: (request: TestRunRequest, name?: string, persist?: boolean) => {
        console.log(`[Tests] Created test run: ${name || 'unnamed'}`);
        return createTestRun(name, persist ?? true);
      },
      dispose: () => console.log(`[Tests] Disposed test controller: ${id}`)
    };
    
    onDidCreateTestControllerEmitter.fire(controller);
    return controller;
  }
};

function createTestItemCollection(): TestItemCollection {
  const items = new Map<string, TestItem>();
  
  return {
    get size() { return items.size; },
    replace: (newItems: readonly TestItem[]) => {
      items.clear();
      newItems.forEach(item => items.set(item.id, item));
    },
    forEach: (callback: (item: TestItem, collection: TestItemCollection) => unknown) => {
      items.forEach(item => callback(item, this));
    },
    add: (item: TestItem) => {
      items.set(item.id, item);
    },
    delete: (itemId: string) => {
      items.delete(itemId);
    },
    get: (itemId: string) => {
      return items.get(itemId);
    }
  };
}

function createTestRun(name?: string, persist: boolean = true): TestRun {
  return {
    name,
    token: { isCancellationRequested: false, onCancellationRequested: new EventEmitter<any>().event },
    isPersisted: persist,
    enqueued: (test: TestItem) => console.log(`[TestRun] Enqueued: ${test.id}`),
    started: (test: TestItem) => console.log(`[TestRun] Started: ${test.id}`),
    skipped: (test: TestItem) => console.log(`[TestRun] Skipped: ${test.id}`),
    failed: (test: TestItem, message: TestMessage | readonly TestMessage[], duration?: number) => {
      console.log(`[TestRun] Failed: ${test.id}`, message, duration);
    },
    errored: (test: TestItem, message: TestMessage | readonly TestMessage[], duration?: number) => {
      console.log(`[TestRun] Errored: ${test.id}`, message, duration);
    },
    passed: (test: TestItem, duration?: number) => {
      console.log(`[TestRun] Passed: ${test.id}`, duration);
    },
    appendOutput: (output: string, location?: Location, test?: TestItem) => {
      console.log(`[TestRun] Output: ${output}`);
    },
    end: () => console.log(`[TestRun] Ended`)
  };
}