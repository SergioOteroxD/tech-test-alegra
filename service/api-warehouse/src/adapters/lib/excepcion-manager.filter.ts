import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../../common/types/custom-error';

export const errorHandler =

  (err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.log('🚀 - err:', err);
    if (err instanceof CustomError) {
      res.status(err.error.code).json({ error: err.error.message });
    }
    res.status(500).send({ errors: [{ message: 'Something went wrong' }] });
    next(err);
  };
