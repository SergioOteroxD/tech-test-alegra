import express from 'express';
import { IngredientsController } from '../api/ingredients.controller';
import { body, validationResult } from 'express-validator';
import { ResponseUtil } from '../../common/util/response.util';

const ingredientsRouter = express.Router();
// Instancia del controlador de autenticación
const inventoryController = new IngredientsController();

ingredientsRouter.post(
  '/request-ingredients',
  body('recipeId').isInt({ min: 1, max: 12 }).notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      ResponseUtil.success(res, {
        code: 'VALIDATION_ERROR',
        message: 'Asegúrate que lo valores estén bien',
        status: 400,
        data: { errors: errors.array() },
      });
      return;
    }
    await inventoryController.requestIngredients(req, res);
  },
);

export default ingredientsRouter;
