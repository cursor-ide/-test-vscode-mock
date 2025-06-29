export interface VSCodeMockConfig {
  // Behavior configuration
  behavior: {
    asyncDelay: number;
    throwOnUnimplemented: boolean;
    validateInputs: boolean;
  };
  
  // Feature flags
  features: {
    enableStateManagement: boolean;
    enableCallRecording: boolean;
    enableMetrics: boolean;
    enableMockPersistence: boolean;
  };
  
  // Mock data configuration
  mockData: {
    workspaceFolders: string[];
    activeExtensions: string[];
    userSettings: Record<string, any>;
  };
  
  // Debug configuration
  debug: {
    logLevel: 'none' | 'error' | 'warn' | 'info' | 'debug';
    logNamespaces: string[];
    breakOnError: boolean;
  };
}

const defaultConfig: VSCodeMockConfig = {
  behavior: {
    asyncDelay: 0,
    throwOnUnimplemented: false,
    validateInputs: true
  },
  features: {
    enableStateManagement: true,
    enableCallRecording: true,
    enableMetrics: false,
    enableMockPersistence: false
  },
  mockData: {
    workspaceFolders: ['/mock/workspace'],
    activeExtensions: [],
    userSettings: {}
  },
  debug: {
    logLevel: 'info',
    logNamespaces: [],
    breakOnError: false
  }
};

class MockConfigManager {
  private config: VSCodeMockConfig = structuredClone(defaultConfig);
  
  load(customConfig: Partial<VSCodeMockConfig>): void {
    this.config = {
      ...this.config,
      ...customConfig,
      behavior: { ...this.config.behavior, ...customConfig.behavior },
      features: { ...this.config.features, ...customConfig.features },
      mockData: { ...this.config.mockData, ...customConfig.mockData },
      debug: { ...this.config.debug, ...customConfig.debug }
    };
  }
  
  get(): Readonly<VSCodeMockConfig> {
    return this.config;
  }
  
  reset(): void {
    this.config = structuredClone(defaultConfig);
  }
}

export const mockConfig = new MockConfigManager();