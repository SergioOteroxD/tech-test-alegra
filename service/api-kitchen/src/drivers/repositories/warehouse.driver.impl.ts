import axios, { AxiosError, AxiosInstance } from 'axios';
import { apisConfig } from '../../common/config';
import { CustomError } from '../../common/types/custom-error';
import { IresponseBase } from '../../common/types/response-base.model';

export class WarehouseDriver {
  private static instance: WarehouseDriver;
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 5000, // Tiempo de espera en ms
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Método para obtener la instancia única
  public static getInstance(): WarehouseDriver {
    if (!WarehouseDriver.instance) {
      WarehouseDriver.instance = new WarehouseDriver(apisConfig.warehouse);
    }
    return WarehouseDriver.instance;
  }

  async get<T>(endpoint: string, params = {}): Promise<T> {
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  async requestIngredients<T>(recipeId: number): Promise<{ data: IresponseBase<{}> }> {
    try {
      const response = await this.client.post<{ data: IresponseBase<{}> }>('/ingredient/request-ingredients', {
        recipeId,
      });
      return response.data;
    } catch (error) {
      if (error?.response?.data.code === 'REQ_ING_BUY_ING') {
        return error.response.data;
      }
      console.log('🚀 ~ WarehouseDriver.requestIngredients ~ error:', error);
      throw new CustomError({ message: 'Error', code: 500 }, 'QueryOrderUC.requestOrder', 'Business');
    }
  }
}
