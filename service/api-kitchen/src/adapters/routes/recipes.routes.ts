import express from 'express';
import { query } from 'express-validator';
import { validateMiddleware } from '../middleware/validate.middleware';
import { RecipesController } from '../api/recipes.controller';

const recipesRouter = express.Router();
// Instancia del controlador de autenticación
const recipesController = new RecipesController();

recipesRouter.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
    query('recipeId').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
  ],
  validateMiddleware,
  async (req, res) => {
    await recipesController.getAll(req, res);
  },
);

export default recipesRouter;
