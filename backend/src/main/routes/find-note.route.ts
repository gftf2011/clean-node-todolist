import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeGetNoteHttpController } from '../factories/app/controllers/rest';
import { makeAuthHttpMiddleware } from '../factories/app/middlewares/rest';

export default (app: Express): void => {
  const controller = makeGetNoteHttpController();
  const AuthHttpMiddleware = makeAuthHttpMiddleware();
  app.get(
    '/api/V1/find-note/:id',
    ExpressMiddlewareAdapter.adaptee(AuthHttpMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
