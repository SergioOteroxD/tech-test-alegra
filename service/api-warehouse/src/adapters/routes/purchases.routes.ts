import express from 'express';
import { query } from 'express-validator';
import { validateMiddleware } from '../middleware/validate.middleware';
import { PurrchasesController } from '../api/purrchases.controller';

const purchasesRouter = express.Router();
// Instancia del controlador de autenticación
const purchasesController = new PurrchasesController();

purchasesRouter.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
    query('recipeId').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
  ],
  validateMiddleware,
  async (req, res) => {
    await purchasesController.getAll(req, res);
  },
);

export default purchasesRouter;
