import Bull from 'bull';
import { TaskQueueDriver } from '../../drivers/repositories/task-queue.driver.impl';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';

export class TaskUC {
  private static instance: TaskUC;

  private eventDriver: TaskQueueDriver;
  constructor() {
    this.eventDriver = TaskQueueDriver.getInstance();
  }

  // Método para obtener la instancia única
  public static getInstance(): TaskUC {
    if (!TaskUC.instance) {
      TaskUC.instance = new TaskUC();
    }
    return TaskUC.instance;
  }

  async add(queue: EwarehouseTask, data: any): Promise<any> {
    return await this.eventDriver.add(queue, data);
  }

  async process(queue: EwarehouseTask, callback: Bull.ProcessCallbackFunction<any>): Promise<any> {
    return await this.eventDriver.process(queue, callback);
  }
}
