import type { Disposable } from './types';

export interface SourceControl {
  id: string;
  label: string;
  rootUri?: any;
  dispose(): void;
}

export const scm = {
  createSourceControl: (id: string, label: string): SourceControl => {
    console.log(`[SCM MOCK]: Created SCM: ${id}, ${label}`);
    return {
      id,
      label,
      dispose: () => console.log(`[SCM MOCK]: Disposed SCM: ${id}`)
    };
  }
};