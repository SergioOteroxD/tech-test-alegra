import { Worker } from 'bullmq';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';
import { UpdateOrderStatusUC } from '../../core/use_case/update-order-status.uc';
import { EstatusOrder } from '../../common/enum/status-order.enum';
import { databaseConfig } from '../../common/config/database';

const updateOrderStatusUc = UpdateOrderStatusUC.getInstance();

new Worker(
  EwarehouseTask.SEND_INGREDIENT,
  async (job) => {
    const taskData = job.data;
    // Lógica para procesar la tarea
    console.log('Processing task:', taskData);
    await updateOrderStatusUc.update(taskData.orderId, { status: EstatusOrder.PREPARING });
  },
  {
    connection: {
      host: databaseConfig.redis.host,
      port: databaseConfig.redis.port,
    },
  },
);
