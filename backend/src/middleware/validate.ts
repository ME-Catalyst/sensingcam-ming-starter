import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const validate = (schema: Joi.ObjectSchema) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw ApiError.badRequest(errorMessage);
    }

    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      throw ApiError.badRequest(errorMessage);
    }

    req.query = value;
    next();
  };
};
