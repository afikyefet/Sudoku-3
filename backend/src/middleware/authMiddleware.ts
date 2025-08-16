import { NextFunction, Request, Response } from 'express';

// Middleware to protect routes (JWT auth)
export const protect = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Implement JWT authentication
    next();
};
