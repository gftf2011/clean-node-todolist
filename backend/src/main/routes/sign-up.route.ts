import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeSignUpController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeSignUpController();
  app.post('/api/V1/sign-up', ExpressRouteAdapter.adaptee(controller));
};
