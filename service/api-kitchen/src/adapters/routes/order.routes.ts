import express from 'express';
import { OrderController } from '../api/order.controller';
import { body, param, query } from 'express-validator';
import { EstatusOrder } from '../../common/enum/status-order.enum';
import { validateMiddleware } from '../middleware/validate.middleware';

const orderRouter = express.Router();
// Instancia del controlador de autenticación
const orderController = new OrderController();

orderRouter.post('/request-order', async (req, res) => {
  await orderController.requestOrder(req, res);
});

orderRouter.patch(
  '/:orderId/update-status',
  [
    body('status').isIn(Object.values(EstatusOrder)).exists(),
    param('orderId').isInt({ min: 1 }).withMessage('El id debe ser un número entero mayor a 0'),
  ],
  validateMiddleware,
  async (req, res) => {
    await orderController.updateStatus(req, res);
  },
);

orderRouter.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer').toInt(),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
    query('recipeId').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer').toInt(),
    query('status').optional().isIn(Object.values(EstatusOrder)).toArray(),
  ],
  validateMiddleware,
  async (req, res) => {
    await orderController.getAllOrder(req, res);
  },
);

orderRouter.get(
  '/:orderId',
  [param('orderId').isInt({ min: 1 }).withMessage('El id debe ser un número entero mayor a 0')],
  validateMiddleware,
  async (req, res) => {
    await orderController.getAllOrder(req, res);
  },
);

export default orderRouter;
