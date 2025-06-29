export const env = {
  appName: 'Visual Studio Code',
  appRoot: '/usr/share/code',
  appHost: 'desktop',
  language: 'en',
  machineId: 'mock-machine-id',
  sessionId: 'mock-session-id',
  remoteName: undefined as string | undefined,
  shell: process.env.SHELL || '/bin/bash',
  uriScheme: 'vscode',
  
  clipboard: {
    readText: async (): Promise<string> => {
      console.log('[Clipboard] Read text');
      return '';
    },
    writeText: async (value: string): Promise<void> => {
      console.log(`[Clipboard] Write text: ${value}`);
    }
  },
  
  openExternal: async (target: Uri): Promise<boolean> => {
    console.log(`[Env] Opening external: ${target.toString()}`);
    return true;
  },
  
  asExternalUri: async (target: Uri): Promise<Uri> => {
    console.log(`[Env] Converting to external URI: ${target.toString()}`);
    return target;
  }
};