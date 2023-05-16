import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeSignInHttpController } from '../factories/app/controllers/rest';

export default (app: Express): void => {
  const controller = makeSignInHttpController();
  app.post('/api/V1/sign-in', ExpressRouteAdapter.adaptee(controller));
};
