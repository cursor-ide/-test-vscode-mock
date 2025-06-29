import { EventEmitter } from './EventEmitter';
import type { Event, Terminal } from './types';

const onDidOpenTerminalEmitter = new EventEmitter<Terminal>();
const onDidCloseTerminalEmitter = new EventEmitter<Terminal>();

export const windowTerminals: Terminal[] = [];

export const terminal = {
  onDidOpenTerminal: onDidOpenTerminalEmitter.event,
  onDidCloseTerminal: onDidCloseTerminalEmitter.event,

  createTerminal: (name: string): Terminal => {
    const terminal: Terminal = {
      name,
      sendText: (text: string) => console.log(`[Terminal:${name}] ${text}`),
      show: () => {},
      hide: () => {},
      dispose: () => {
        windowTerminals.splice(windowTerminals.indexOf(terminal), 1);
        onDidCloseTerminalEmitter.fire(terminal);
        console.log(`[DisposedTerminal] ${name}`);
      },
    };
    windowTerminals.push(terminal);
    onDidOpenTerminalEmitter.fire(terminal);
    return terminal;
  },
};