/* eslint-disable sort-imports */
import { Request, Response } from 'express';

import { Controller } from '../../app/contracts/controllers';
import { HttpRequest } from '../../app/contracts/http';

type Adapter = (req: Request, res: Response) => Promise<void>;

// It uses the adapter design pattern
export class ExpressRouteAdapter {
  static adaptee(controller: Controller): Adapter {
    return async (req: Request, res: Response) => {
      const httpRequest: HttpRequest = {
        body: req.body,
        headers: req.headers,
      };
      const httpResponse = await controller.handle(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
}
