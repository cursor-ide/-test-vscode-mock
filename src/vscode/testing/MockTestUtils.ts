import { mockSystem } from '../core/MockSystem';
import type { Disposable } from '../types';

export class VSCodeMockTestUtils {
  private disposables: Disposable[] = [];

  async setup(config?: any): Promise<void> {
    // Reset mock system
    mockSystem.dispose();
    
    // Start recording
    mockSystem.startRecording();
  }

  async teardown(): Promise<void> {
    // Stop recording and get history
    const history = mockSystem.stopRecording();
    
    // Clean up disposables
    this.disposables.forEach(d => d.dispose());
    this.disposables = [];
    
    // Log summary if needed
    if (process.env.VSCODE_MOCK_DEBUG) {
      console.log(`[MockTest] Recorded ${history.length} calls`);
    }
  }

  expectCalled(namespace: string, method: string, times?: number): void {
    const history = mockSystem.stopRecording();
    const calls = history.filter(h => h.method === `${namespace}.${method}`);
    
    if (times !== undefined) {
      if (calls.length !== times) {
        throw new Error(`Expected ${namespace}.${method} to be called ${times} times, but was called ${calls.length} times`);
      }
    } else if (calls.length === 0) {
      throw new Error(`Expected ${namespace}.${method} to be called, but it wasn't`);
    }
    
    // Resume recording
    mockSystem.startRecording();
  }

  getCallHistory(namespace?: string, method?: string) {
    const history = mockSystem.stopRecording();
    mockSystem.startRecording();
    
    if (namespace && method) {
      return history.filter(h => h.method === `${namespace}.${method}`);
    } else if (namespace) {
      return history.filter(h => h.method.startsWith(`${namespace}.`));
    }
    
    return history;
  }

  async simulateDelay(ms: number): Promise<void> {
    await Bun.sleep(ms);
  }

  mockUserInput<T>(value: T): void {
    // Store for next user input request
    (globalThis as any).__mockUserInput = value;
  }
}

export const testUtils = new VSCodeMockTestUtils();