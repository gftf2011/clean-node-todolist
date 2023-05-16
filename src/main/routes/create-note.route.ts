import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeCreateNoteHttpController } from '../factories/app/controllers/rest';
import { makeAuthHttpMiddleware } from '../factories/app/middlewares/rest';

export default (app: Express): void => {
  const controller = makeCreateNoteHttpController();
  const AuthHttpMiddleware = makeAuthHttpMiddleware();
  app.post(
    '/api/V1/create-note',
    ExpressMiddlewareAdapter.adaptee(AuthHttpMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
