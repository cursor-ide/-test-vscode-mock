// Centralized state management for better testing and debugging
export class StateManager<T> {
  private state: T;
  private readonly subscribers = new Set<(state: T, prevState: T) => void>();
  private readonly history: Array<{ state: T; timestamp: number }> = [];
  private readonly maxHistory: number;

  constructor(initialState: T, maxHistory = 10) {
    this.state = structuredClone(initialState);
    this.maxHistory = maxHistory;
    this.history.push({ state: this.state, timestamp: Date.now() });
  }

  get current(): Readonly<T> {
    return this.state;
  }

  update(updater: (state: T) => Partial<T> | T): void {
    const prevState = this.state;
    const updates = updater(structuredClone(this.state));
    
    this.state = updates && typeof updates === 'object' && !Array.isArray(updates)
      ? { ...this.state, ...updates }
      : updates as T;

    // Record history
    this.history.push({ state: structuredClone(this.state), timestamp: Date.now() });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Notify subscribers
    this.subscribers.forEach(subscriber => {
      try {
        subscriber(this.state, prevState);
      } catch (e) {
        console.error('[StateManager] Subscriber error:', e);
      }
    });
  }

  subscribe(subscriber: (state: T, prevState: T) => void): Disposable {
    this.subscribers.add(subscriber);
    return {
      dispose: () => this.subscribers.delete(subscriber)
    };
  }

  getHistory() {
    return [...this.history];
  }

  reset(): void {
    if (this.history.length > 0) {
      this.update(() => this.history[0].state);
    }
  }
}