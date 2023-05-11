import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeSignUpHttpController } from '../factories/app/controllers/rest';

export default (app: Express): void => {
  const controller = makeSignUpHttpController();
  app.post('/api/V1/sign-up', ExpressRouteAdapter.adaptee(controller));
};
