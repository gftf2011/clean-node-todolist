import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeUpdateNoteHttpController } from '../factories/app/controllers/rest';
import { makeAuthHttpMiddleware } from '../factories/app/middlewares/rest';

export default (app: Express): void => {
  const controller = makeUpdateNoteHttpController();
  const AuthHttpMiddleware = makeAuthHttpMiddleware();
  app.put(
    '/api/V1/update-note',
    ExpressMiddlewareAdapter.adaptee(AuthHttpMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
