import { NextFunction, Request, Response } from 'express';

export const requestHttpInterceptorHandler = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now(); // Tiempo de inicio
    console.log(`[${req.method}] ${req.originalUrl}`);

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next(); // Continúa con la siguiente función
};
