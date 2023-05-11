import { Express } from 'express';

import { ExpressRouteAdapter, ExpressMiddlewareAdapter } from '../adapters';
import { makeDeleteNoteHttpController } from '../factories/app/controllers/rest';
import { makeAuthHttpMiddleware } from '../factories/app/middlewares/rest';

export default (app: Express): void => {
  const controller = makeDeleteNoteHttpController();
  const AuthHttpMiddleware = makeAuthHttpMiddleware();
  app.delete(
    '/api/V1/delete-note',
    ExpressMiddlewareAdapter.adaptee(AuthHttpMiddleware),
    ExpressRouteAdapter.adaptee(controller),
  );
};
