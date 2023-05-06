import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeCreateNoteController } from '../factories/app/controllers';
import { makeAuthMiddleware } from '../factories/app/middlewares';

export default (app: Express): void => {
  const controller = makeCreateNoteController();
  const authMiddleware = makeAuthMiddleware();
  app.post(
    '/api/V1/create-note',
    ExpressMiddlewareAdapter.adaptee(authMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
