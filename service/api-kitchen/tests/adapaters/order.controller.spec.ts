import request from 'supertest';
import express, { Express } from 'express';
import { OrderController } from '../../src/adapters/api/order.controller';
import { RequestOrderUC } from '../../src/core/use_case/request-order.uc';
import { QueryOrderUC } from '../../src/core/use_case/query-order.uc';
import { UpdateOrderStatusUC } from '../../src/core/use_case/update-order-status.uc';
import { EstatusOrder } from '../../src/common/enum/status-order.enum';

RequestOrderUC.getInstance = jest.fn().mockReturnValue({ requestOrder: jest.fn() });
QueryOrderUC.getInstance = jest.fn().mockReturnValue({ getAll: jest.fn(), getOne: jest.fn() });
UpdateOrderStatusUC.getInstance = jest.fn().mockReturnValue({ requestOrder: jest.fn() });

describe('OrderController', () => {
  let app: Express;
  let mockRequestOrderUC: jest.Mocked<RequestOrderUC>;
  let mockQueryOrderUC: jest.Mocked<QueryOrderUC>;
  let mockUpdateOrderStatusUC: jest.Mocked<UpdateOrderStatusUC>;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Initialize controller
    const orderController = new OrderController();

    // Setup routes
    app.post('/orders', orderController.requestOrder.bind(orderController));
    app.get('/orders', orderController.getAllOrder.bind(orderController));
    app.get('/orders/:orderId', orderController.getOne.bind(orderController));
    app.patch('/orders/:orderId/status', orderController.updateStatus.bind(orderController));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /orders', () => {
    it('should create a new order successfully', async () => {
      const mockResponse = {
        code: 'REQ_ORDER_OK',
        status: 201,
        message: 'La orden se ha solicitado correctamente.',
        data: {
          orderId: 1,
          recipe: { recipeId: 1, name: 'Test Recipe' },
        },
      };

      RequestOrderUC.getInstance().requestOrder = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app).post('/orders').expect(201);

      expect(response.body.code).toBe('REQ_ORDER_OK');
    });
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const mockOrders = {
        code: 'OK',
        status: 200,
        message: 'Datos consultados correctamente.',
        data: [
          {
            id: 1,
            status: EstatusOrder.PENDING,
            recipeId: 1,
          },
        ],
      };

      QueryOrderUC.getInstance().getAll = jest.fn().mockResolvedValue(mockOrders);

      const response = await request(app).get('/orders').query({ page: 1, limit: 10 }).expect(200);

      expect(response.body.code).toBe('OK');
    });
  });

  describe('GET /orders/:orderId', () => {
    it('should return a specific order', async () => {
      const mockOrder = {
        code: 'OK',
        status: 200,
        message: 'Datos consultados correctamente.',
        data: {
          id: 1,
          status: EstatusOrder.PENDING,
          recipeId: 1,
        },
      };

      QueryOrderUC.getInstance().getOne = jest.fn().mockResolvedValue(mockOrder);

      const response = await request(app).get('/orders/1').expect(200);

      expect(response.body.code).toBe('OK');
    });
  });

  describe('PATCH /orders/:orderId/status', () => {
    it('should update order status', async () => {
      const mockUpdate = {
        code: 'UPD_ORDER_OK',
        status: 200,
        message: 'Estado actualizado correctamente.',
        data: {
          id: 1,
          status: EstatusOrder.PREPARING,
        },
      };

      UpdateOrderStatusUC.getInstance().update = jest.fn().mockResolvedValue(mockUpdate);

      const response = await request(app)
        .patch('/orders/1/status')
        .send({ status: EstatusOrder.PREPARING })
        .expect(200);

      expect(response.body.code).toBe('UPD_ORDER_OK');
    });

    it('should return 404 when order not found', async () => {
      const mockError = {
        code: 'UPD_ORDER_NOT_FOUND',
        status: 404,
        message: 'No se encontró la orden.',
      };

      UpdateOrderStatusUC.getInstance().update = jest.fn().mockResolvedValue(mockError);

      await request(app).patch('/orders/999/status').send({ status: EstatusOrder.PREPARING }).expect(404);
    });
  });
});
