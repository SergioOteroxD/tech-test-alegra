import { Response } from 'express';
import { IresponseBase } from '../types/response-base.model';

export class ResponseUtil {
  static success(res: Response, data: IresponseBase, statusCode: number = 500): Response {
    return res.status(data?.status).json({
      code: data.code,
      message: data.message,
      data: data?.data,
      pagination: data?.pagination,
    });
  }

  static error(res: Response, error: any, message: string = 'An error occurred', statusCode: number = 500): Response {
    return res.status(statusCode).json({
      status: 'error',
      message,
      error: error instanceof Error ? error.message : error,
    });
  }
}
