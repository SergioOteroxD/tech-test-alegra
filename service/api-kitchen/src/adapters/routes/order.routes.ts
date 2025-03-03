import express from 'express';
import { OrderController } from '../api/order.controller';

const orderRouter = express.Router();
// Instancia del controlador de autenticación
const orderController = new OrderController();

orderRouter.post('/request-order', async (req, res) => {
  await orderController.requestOrder(req, res);
});

export default orderRouter;
