import { EventEmitter } from './EventEmitter';
import type { Event, Disposable } from './types';

export interface AuthenticationSession {
  id: string;
  accessToken: string;
  account: { label: string; id: string };
  scopes: string[];
}

const onDidChangeSessionsEmitter = new EventEmitter<{providerId: string}>();

export const authentication = {
  onDidChangeSessions: onDidChangeSessionsEmitter.event,
  getSession: async (
    providerId: string,
    scopes: string[],
    options?: { createIfNone?: boolean }
  ): Promise<AuthenticationSession | undefined> => {
    console.log(`[AUTH MOCK]: Get session for provider ${providerId} with scopes ${scopes.join(',')}`);
    return {
      id: 'mock-session',
      accessToken: 'token_mock',
      account: { label: 'Mock User', id: 'mock_user' },
      scopes
    };
  },
  registerAuthenticationProvider: (
    providerId: string,
    providerLabel: string,
    provider: any
  ): Disposable => {
    console.log(`[AUTH MOCK]: Registered provider ${providerId}`);
    return {
      dispose: () => console.log(`[AUTH MOCK]: Provider disposed ${providerId}`)
    };
  }
};