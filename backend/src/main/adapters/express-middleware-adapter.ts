/* eslint-disable sort-imports */
import { Request, Response, NextFunction } from 'express';

import { Middleware } from '../../app/contracts/middlewares';
import { HttpRequest } from '../../app/contracts/http';

type Adapter = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// It uses the adapter design pattern
export class ExpressMiddlewareAdapter {
  static adaptee(middleware: Middleware): Adapter {
    return async (req: Request, res: Response, next: NextFunction) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        headers: req.headers,
      };
      const httpResponse = await middleware.handle(httpRequest);
      if (httpResponse.statusCode === 200) {
        req.body = {
          ...req.body,
          ...httpResponse.body,
        };
        next();
      } else {
        /**
         * Necessary use of else to avoid server possible double response
         */
        res.status(httpResponse.statusCode).json(httpResponse.body);
      }
    };
  }
}
