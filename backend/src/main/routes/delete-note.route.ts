import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeDeleteNoteController } from '../factories/app/controllers';
import { makeAuthMiddleware } from '../factories/app/middlewares';

export default (app: Express): void => {
  const controller = makeDeleteNoteController();
  const authMiddleware = makeAuthMiddleware();
  app.delete(
    '/api/V1/delete-note',
    ExpressMiddlewareAdapter.adaptee(authMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
