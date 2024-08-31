import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction) {
  res.status(err.statusCode || 500).json({
    error_code: err.code || 'INTERNAL_ERROR',
    error_description: err.message || 'Ocorreu um erro interno'
  });
}
