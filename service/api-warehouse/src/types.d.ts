import * as express from 'express';
import { IauthPayload } from 'src/common/types/auth-payload';

declare global {
  namespace Express {
    interface Request {
      user?: IauthPayload; // Define la estructura que esperas en `req.user`
      controller?: any; // O cualquier tipo que desees
      method?: string;
    }
  }
}
