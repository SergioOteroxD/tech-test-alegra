import { RequestIngredientsUC } from '../../core/use_case/request-ingredients.uc';
import { TaskUC } from '../../core/use_case/task-queue.uc';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';

const taskQueue = TaskUC.getInstance();

const requestIngredientsUc = RequestIngredientsUC.getInstance();

taskQueue.process(EwarehouseTask.BUY_INGREDIENT, (job) => {
  const taskData = job.data;
  // Lógica para procesar la tarea
  console.log('Processing task:', taskData);
  requestIngredientsUc.requestIngredients(taskData);
});
