import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeUpdateNoteController } from '../factories/app/controllers';
import { makeAuthMiddleware } from '../factories/app/middlewares';

export default (app: Express): void => {
  const controller = makeUpdateNoteController();
  const authMiddleware = makeAuthMiddleware();
  app.put(
    '/api/V1/update-note',
    ExpressMiddlewareAdapter.adaptee(authMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
