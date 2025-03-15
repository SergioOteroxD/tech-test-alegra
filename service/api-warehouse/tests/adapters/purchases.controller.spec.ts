import request from 'supertest';
import express, { Express } from 'express';
import { PurrchasesController } from '../../src/adapters/api/purchases.controller';
import { QueryPurchasesUC } from '../../src/core/use_case/query-purchases.uc';
import { CustomError } from '../../src/common/types/custom-error';

QueryPurchasesUC.getInstance = jest.fn().mockReturnValue({ getAll: jest.fn() });

describe('PurchasesController', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    const purchasesController = new PurrchasesController();

    // Setup routes
    app.get('/purchases', purchasesController.getAll.bind(purchasesController));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /purchases', () => {
    it('should return all purchases successfully', async () => {
      const mockResponse = {
        code: 'OK',
        status: 200,
        message: 'Success',
        data: [
          {
            id: 1,
            ingredientId: 1,
            quantity: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        pagination: {
          totalDocuments: 1,
          pageIndex: 1,
          pageSize: 10,
          totalPages: 1,
          previousPageIndex: null,
          nextPageIndex: null,
        },
      };

      QueryPurchasesUC.getInstance().getAll = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/purchases').query({ page: '1', limit: '10' }).expect(200);

      expect(response.body.code).toBe('OK');
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toBeDefined();
    });

    it('should handle CustomError', async () => {
      const customError = new CustomError(
        {
          code: 400,
          message: 'Bad Request',
        },
        'PurchasesController.getAll',
        'Technical',
      );

      QueryPurchasesUC.getInstance().getAll = jest.fn().mockRejectedValue(customError);

      const response = await request(app).get('/purchases').query({ page: 1, limit: 10 }).expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should handle generic error', async () => {
      QueryPurchasesUC.getInstance().getAll = jest.fn().mockRejectedValue(new Error('Server Error'));

      const response = await request(app).get('/purchases').query({ page: 1, limit: 10 }).expect(500);

      expect(response.body.message).toBeDefined();
    });

    it('should use default pagination values when not provided', async () => {
      const mockData = {
        code: 'OK',
        status: 200,
        message: 'Success',
        data: [],
        pagination: {
          totalDocuments: 0,
          pageIndex: 1,
          pageSize: 10,
          totalPages: 0,
          previousPageIndex: null,
          nextPageIndex: null,
        },
      };

      QueryPurchasesUC.getInstance().getAll = jest.fn().mockResolvedValue(mockData);

      const response = await request(app).get('/purchases').expect(200);

      expect(QueryPurchasesUC.getInstance().getAll).toHaveBeenCalledWith(1, 10, { page: undefined, limit: undefined });
    });
  });
});
