import { IresponseBase } from './response-base.model';

export class CustomError implements IresponseBase {
  public details?: any;
  public code: string;
  public message: string;
  public status: number;

  constructor(
    public readonly error: { code: number; message: string },
    public readonly context: string,
    public readonly type: 'Business' | 'Technical',
    details?: any
  ) {
    this.details = details;
    this.status = error.code;
    this.code = 'ERROR';
    this.message = error.message;
  }
}
