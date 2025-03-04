import Bull, { Queue } from 'bull';
import { taskQueue } from '../database/redis.connect';

export class TaskQueueDriver {
  private static instance: TaskQueueDriver;
  private taskQueue: Queue;

  constructor() {
    this.taskQueue = taskQueue;
  }

  // Método para obtener la instancia única
  public static getInstance(): TaskQueueDriver {
    if (!TaskQueueDriver.instance) {
      TaskQueueDriver.instance = new TaskQueueDriver();
    }
    return TaskQueueDriver.instance;
  }

  async add(data: any): Promise<any> {
    console.log(`💡 Tarea enviada:`, data);
    return await this.taskQueue.add(data);
  }

  async process(callback: Bull.ProcessCallbackFunction<any>): Promise<any> {
    return await this.taskQueue.process(callback);
  }
}
