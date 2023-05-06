import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeUpdateFinishedNoteController } from '../factories/app/controllers';
import { makeAuthMiddleware } from '../factories/app/middlewares';

export default (app: Express): void => {
  const controller = makeUpdateFinishedNoteController();
  const authMiddleware = makeAuthMiddleware();
  app.patch(
    '/api/V1/update-finished-note',
    ExpressMiddlewareAdapter.adaptee(authMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
