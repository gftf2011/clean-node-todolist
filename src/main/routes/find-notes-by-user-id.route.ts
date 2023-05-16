import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeGetNotesByUserIdHttpController } from '../factories/app/controllers/rest';
import { makeAuthHttpMiddleware } from '../factories/app/middlewares/rest';

export default (app: Express): void => {
  const controller = makeGetNotesByUserIdHttpController();
  const AuthHttpMiddleware = makeAuthHttpMiddleware();
  app.get(
    '/api/V1/find-notes',
    ExpressMiddlewareAdapter.adaptee(AuthHttpMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
