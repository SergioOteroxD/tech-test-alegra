import request from 'supertest';
import express, { Express } from 'express';
import { IngredientsController } from '../../src/adapters/api/ingredients.controller';
import { QueryInventoryUC } from '../../src/core/use_case/query-ingredients.uc';
import { Response } from 'express';
import { CustomError } from '../../src/common/types/custom-error';

QueryInventoryUC.getInstance = jest.fn().mockReturnValue({ getAll: jest.fn() });

describe('IngredientsController', () => {
  let app: Express;

  let ingredientsController: IngredientsController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    ingredientsController = new IngredientsController();
    app.get('/ingredient', ingredientsController.getAll.bind(ingredientsController));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /ingredient', () => {
    it('should return all ingredients successfully', async () => {
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

      QueryInventoryUC.getInstance().getAll = jest.fn().mockResolvedValue(mockResponse);

      const response = await request(app).get('/ingredient').query({ page: '1', limit: '10' }).expect(200);

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

      QueryInventoryUC.getInstance().getAll = jest.fn().mockRejectedValue(customError);

      const response = await request(app).get('/ingredient').query({ page: 1, limit: 10 }).expect(400);

      expect(response.body.error).toBe('Bad Request');
    });

    it('should handle generic error', async () => {
      QueryInventoryUC.getInstance().getAll = jest.fn().mockRejectedValue(new Error('Server Error'));

      const response = await request(app).get('/ingredient').query({ page: 1, limit: 10 }).expect(500);

      expect(response.body.message).toBeDefined();
    });
  });
});
