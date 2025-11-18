import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/ApiError';
import { JWTPayload } from '../types';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authenticateToken = (_req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    throw ApiError.unauthorized('Access token required');
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    throw ApiError.unauthorized('Invalid or expired token');
  }
};

export const authorize = (...roles: string[]) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden('Insufficient permissions');
    }

    next();
  };
};
