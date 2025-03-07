import { Worker } from 'bullmq';
import { RequestIngredientsUC } from '../../core/use_case/request-ingredients.uc';
import { EwarehouseTask } from '../../common/enum/warehouse-queue.enum';
import { databaseConfig } from '../../common/config';

const requestIngredientsUc = RequestIngredientsUC.getInstance();

new Worker(
  EwarehouseTask.BUY_INGREDIENT,
  async (job) => {
    const taskData = job.data;
    // Lógica para procesar la tarea
    console.log('Processing task:', taskData);
    await requestIngredientsUc.requestIngredients(taskData);
  },
  {
    connection: {
      host: databaseConfig.redis.host,
      port: databaseConfig.redis.port,
    },

    limiter: {
      max: 1, // 👈 Solo permite un trabajo activo a la vez
      duration: 1000, // (Opcional) Espera 1 segundo antes de procesar el siguiente
    },
  },
);
