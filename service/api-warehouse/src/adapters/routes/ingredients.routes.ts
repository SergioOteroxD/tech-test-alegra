import express from 'express';
import { IngredientsController } from '../api/ingredients.controller';
import { body, query } from 'express-validator';
import { validateMiddleware } from '../middleware/validate.middleware';

const ingredientsRouter = express.Router();
// Instancia del controlador de autenticación
const inventoryController = new IngredientsController();

ingredientsRouter.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
  ],
  validateMiddleware,
  async (req, res) => {
    await inventoryController.getAll(req, res);
  },
);

export default ingredientsRouter;
