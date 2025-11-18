import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Log error
  logger.error('Error occurred:', {
    statusCode,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Send response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });

  // Exit process for non-operational errors in production
  if (!isOperational && config.nodeEnv === 'production') {
    logger.error('Non-operational error. Exiting process...');
    process.exit(1);
  }
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
};
