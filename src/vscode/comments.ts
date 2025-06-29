import { EventEmitter } from './EventEmitter';
import type { Event, Disposable, Uri, Range, Command } from './types';

export interface CommentController {
  id: string;
  label: string;
  options?: CommentOptions;
  commentingRangeProvider?: CommentingRangeProvider;
  createCommentThread(uri: Uri, range: Range, comments: Comment[]): CommentThread;
  dispose(): void;
}

export interface CommentThread {
  uri: Uri;
  range: Range;
  comments: Comment[];
  collapsibleState: CommentThreadCollapsibleState;
  canReply: boolean;
  contextValue?: string;
  label?: string;
  state?: CommentThreadState;
  dispose(): void;
}

export interface Comment {
  author: CommentAuthorInformation;
  body: string | MarkdownString;
  mode: CommentMode;
  reactions?: CommentReaction[];
  label?: string;
  contextValue?: string;
}

export interface CommentAuthorInformation {
  name: string;
  iconPath?: Uri;
}

export interface CommentReaction {
  label: string;
  iconPath: string | Uri;
  count: number;
  authorHasReacted: boolean;
}

export interface CommentOptions {
  prompt?: string;
  placeHolder?: string;
}

export interface CommentingRangeProvider {
  provideCommentingRanges(document: TextDocument, token: CancellationToken): ProviderResult<Range[]>;
}

export interface MarkdownString {
  value: string;
  isTrusted?: boolean;
}

export interface TextDocument {
  uri: Uri;
}

export interface CancellationToken {
  isCancellationRequested: boolean;
}

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

type ProviderResult<T> = T | undefined | null | Thenable<T | undefined | null>;

export const comments = {
  createCommentController(id: string, label: string): CommentController {
    console.log(`[Comments] Created controller: ${id}`);
    
    const controller: CommentController = {
      id,
      label,
      createCommentThread: (uri: Uri, range: Range, comments: Comment[]) => {
        console.log(`[Comments] Created thread at ${uri.toString()}`);
        return createCommentThread(uri, range, comments);
      },
      dispose: () => console.log(`[Comments] Disposed controller: ${id}`)
    };
    
    return controller;
  }
};

function createCommentThread(uri: Uri, range: Range, comments: Comment[]): CommentThread {
  return {
    uri,
    range,
    comments,
    collapsibleState: CommentThreadCollapsibleState.Expanded,
    canReply: true,
    dispose: () => console.log(`[Comments] Disposed thread at ${uri.toString()}`)
  };
}