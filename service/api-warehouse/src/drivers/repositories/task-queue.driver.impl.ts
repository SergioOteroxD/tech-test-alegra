import { Queue } from 'bullmq';
import { buyIngredientQueue, sendIngredientQueue } from '../database/redis.connect';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';

export class TaskQueueDriver {
  private static instance: TaskQueueDriver;
  private buyIngredient: Queue;
  private getIngrdient: Queue;

  constructor() {
    this.buyIngredient = buyIngredientQueue;
    this.getIngrdient = sendIngredientQueue;
  }

  // Método para obtener la instancia única
  public static getInstance(): TaskQueueDriver {
    if (!TaskQueueDriver.instance) {
      TaskQueueDriver.instance = new TaskQueueDriver();
    }
    return TaskQueueDriver.instance;
  }

  async add(queue: EwarehouseTask, data: any): Promise<any> {
    console.log(`💡 Tarea enviada ${queue}`, data);
    if (queue === EwarehouseTask.BUY_INGREDIENT) {
      return await this.buyIngredient.add(queue, data);
    }
    if (queue === EwarehouseTask.SEND_INGREDIENT) {
      return await this.getIngrdient.add(queue, data);
    }
  }
}
