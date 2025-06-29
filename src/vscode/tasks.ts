import { EventEmitter } from './EventEmitter';
import type { Event } from './types';

export interface Task {
  name: string;
  source: string;
  execution?: any;
}

const onDidStartTaskEmitter = new EventEmitter<Task>();
const onDidEndTaskEmitter = new EventEmitter<Task>();

export const tasks = {
  taskExecutions: [] as Task[],
  onDidStartTask: onDidStartTaskEmitter.event,
  onDidEndTask: onDidEndTaskEmitter.event,
  executeTask: async (task: Task) => {
    console.log(`[TASK MOCK]: Executing task: ${task.name}`);
    tasks.taskExecutions.push(task);
    onDidStartTaskEmitter.fire(task);
    setTimeout(() => {
      onDidEndTaskEmitter.fire(task);
      tasks.taskExecutions = tasks.taskExecutions.filter(t => t !== task);
    }, 500);
    return { task, terminate: () => {} };
  }
};