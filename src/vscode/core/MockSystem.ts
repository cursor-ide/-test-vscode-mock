import { StateManager } from '../StateManager';
import type { Disposable } from '../types';

interface MockSystemConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  enablePlayback?: boolean;
  mockDelay?: number;
}

interface MockCall {
  method: string;
  args: any[];
  result?: any;
  error?: any;
  timestamp: number;
  duration: number;
}

export class MockSystem {
  private static instance: MockSystem;
  private readonly config: MockSystemConfig;
  private readonly callHistory: MockCall[] = [];
  private readonly stateManagers = new Map<string, StateManager<any>>();
  private readonly disposables: Disposable[] = [];
  private recording = false;

  private constructor(config: MockSystemConfig = {}) {
    this.config = {
      enableLogging: true,
      enableMetrics: true,
      enablePlayback: false,
      mockDelay: 0,
      ...config
    };
  }

  static getInstance(config?: MockSystemConfig): MockSystem {
    if (!MockSystem.instance) {
      MockSystem.instance = new MockSystem(config);
    }
    return MockSystem.instance;
  }

  createStateManager<T>(name: string, initialState: T): StateManager<T> {
    const manager = new StateManager(initialState);
    this.stateManagers.set(name, manager);
    return manager;
  }

  async mockCall<T>(
    namespace: string,
    method: string,
    implementation: (...args: any[]) => T | Promise<T>,
    ...args: any[]
  ): Promise<T> {
    const start = performance.now();
    const callId = `${namespace}.${method}`;

    try {
      if (this.config.enableLogging) {
        console.log(`[${namespace}] ${method}`, args);
      }

      // Add artificial delay if configured
      if (this.config.mockDelay > 0) {
        await Bun.sleep(this.config.mockDelay);
      }

      const result = await implementation(...args);
      
      const duration = performance.now() - start;
      
      if (this.recording) {
        this.callHistory.push({
          method: callId,
          args,
          result,
          timestamp: Date.now(),
          duration
        });
      }

      if (this.config.enableMetrics) {
        this.updateMetrics(callId, duration);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      if (this.recording) {
        this.callHistory.push({
          method: callId,
          args,
          error,
          timestamp: Date.now(),
          duration
        });
      }

      throw error;
    }
  }

  private updateMetrics(method: string, duration: number): void {
    // TODO: Implement metrics collection
  }

  startRecording(): void {
    this.recording = true;
    this.callHistory.length = 0;
  }

  stopRecording(): MockCall[] {
    this.recording = false;
    return [...this.callHistory];
  }

  async replay(calls: MockCall[], speed = 1): Promise<void> {
    if (!this.config.enablePlayback) {
      throw new Error('Playback is not enabled');
    }

    for (let i = 0; i < calls.length; i++) {
      const call = calls[i];
      const nextCall = calls[i + 1];
      
      console.log(`[Replay] ${call.method}`, call.args);
      
      if (nextCall) {
        const delay = (nextCall.timestamp - call.timestamp) / speed;
        await Bun.sleep(delay);
      }
    }
  }

  dispose(): void {
    this.disposables.forEach(d => d.dispose());
    this.disposables.length = 0;
    this.stateManagers.clear();
    this.callHistory.length = 0;
  }
}

export const mockSystem = MockSystem.getInstance();