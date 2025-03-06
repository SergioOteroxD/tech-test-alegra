import { TaskUC } from '../../core/use_case/task-queue.uc';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';
import { UpdateOrderStatusUC } from '../../core/use_case/update-order-status.uc';
import { EstatusOrder } from '../../common/enum/status-order.enum';

const taskQueue = TaskUC.getInstance();

const updateOrderStatusUc = UpdateOrderStatusUC.getInstance();

taskQueue.process(EwarehouseTask.SEND_INGREDIENT, async (job) => {
  const taskData = job.data;
  // Lógica para procesar la tarea
  console.log('Processing task:', taskData);
  await updateOrderStatusUc.update(taskData.orderId, { status: EstatusOrder.PREPARING });
});
