import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        success: false,
        error: message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        path: req.originalUrl,
    });
}
