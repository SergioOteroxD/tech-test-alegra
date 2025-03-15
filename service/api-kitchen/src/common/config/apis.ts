import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno
export const apisConfig = {
  warehouse: process.env.WAREHOUSE_URL || 'http://localhost:3002/warehouse/v1',
};
