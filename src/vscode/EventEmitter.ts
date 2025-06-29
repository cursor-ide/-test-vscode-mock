import type { Disposable, Event } from './types';

// Optimized EventEmitter using WeakMap for better memory management
const listenerRegistry = new WeakMap<EventEmitter<any>, Set<Function>>();

export class EventEmitter<T> implements Disposable {
  private _disposed = false;
  private _listeners: Set<Function>;
  private _deliveryQueue: Array<{ listener: Function; event: T }> | undefined;
  private _delivering = false;

  constructor() {
    this._listeners = new Set();
    listenerRegistry.set(this, this._listeners);
  }

  public get event(): Event<T> {
    return (listener, thisArgs?, disposables?) => {
      if (this._disposed) {
        throw new Error('EventEmitter has been disposed');
      }

      const boundListener = thisArgs ? listener.bind(thisArgs) : listener;
      this._listeners.add(boundListener);

      const disposable: Disposable = {
        dispose: () => {
          if (!this._disposed) {
            this._listeners.delete(boundListener);
          }
        }
      };

      disposables?.push(disposable);
      return disposable;
    };
  }

  fire(event: T): void {
    if (this._disposed) {
      return;
    }

    // Queue events if already delivering to prevent infinite loops
    if (this._delivering) {
      if (!this._deliveryQueue) {
        this._deliveryQueue = [];
      }
      this._deliveryQueue.push(...Array.from(this._listeners).map(listener => ({ listener, event })));
      return;
    }

    try {
      this._delivering = true;
      
      // Use array spread for iteration safety
      const listeners = [...this._listeners];
      for (const listener of listeners) {
        try {
          listener(event);
        } catch (e) {
          console.error('[EventEmitter] Listener error:', e);
          // Continue with other listeners
        }
      }
    } finally {
      this._delivering = false;
      
      // Process queued events
      if (this._deliveryQueue) {
        const queue = this._deliveryQueue;
        this._deliveryQueue = undefined;
        for (const { listener, event } of queue) {
          try {
            listener(event);
          } catch (e) {
            console.error('[EventEmitter] Queued listener error:', e);
          }
        }
      }
    }
  }

  dispose(): void {
    if (!this._disposed) {
      this._disposed = true;
      this._listeners.clear();
      listenerRegistry.delete(this);
      this._deliveryQueue = undefined;
    }
  }
}

// Global event emitter registry for debugging and monitoring
export const activeEmitters = {
  get count() {
    return Array.from(listenerRegistry.keys()).length;
  },
  
  getListenerCounts() {
    const counts: Record<string, number> = {};
    listenerRegistry.forEach((listeners, emitter) => {
      const name = (emitter as any).name || 'anonymous';
      counts[name] = listeners.size;
    });
    return counts;
  }
};