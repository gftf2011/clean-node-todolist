import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeGetNoteController } from '../factories/app/controllers';
import { makeAuthMiddleware } from '../factories/app/middlewares';

export default (app: Express): void => {
  const controller = makeGetNoteController();
  const authMiddleware = makeAuthMiddleware();
  app.get(
    '/api/V1/find-note/:id',
    ExpressMiddlewareAdapter.adaptee(authMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
