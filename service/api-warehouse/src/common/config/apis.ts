import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno
export const apisConfig = {
  buyIngredients: process.env.BUY_INGREDIENTS_URL,
};
