import { EventUC } from '../../core/use_case/event.uc';
import { EwarehouseEvent } from '../../common/enum/warehouse-event.enum';
import { RequestIngredientsUC } from '../../core/use_case/request-ingredients.uc';
import { TaskUC } from '../../core/use_case/task-queue.uc';

const eventSubscriber = EventUC.getInstance();
const taskQueue = TaskUC.getInstance();

const requestIngredientsUc = RequestIngredientsUC.getInstance();

eventSubscriber.subscribe([EwarehouseEvent.BUY_INGREDIENTS]);

eventSubscriber.on('message', (channel: EwarehouseEvent, message) => {
  const data = JSON.parse(message);
  console.log(`📩 Mensaje recibido en el canal ${channel}:`, data);
  switch (channel) {
    case EwarehouseEvent.BUY_INGREDIENTS:
      requestIngredientsUc.requestOrder(data);
      break;

    default:
      break;
  }
});

taskQueue.process((job) => {
  const taskData = job.data;
  // Lógica para procesar la tarea
  console.log('Processing task:', taskData);
  requestIngredientsUc.requestOrder(taskData);
});
