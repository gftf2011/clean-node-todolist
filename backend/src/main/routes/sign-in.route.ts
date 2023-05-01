import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeSignInController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeSignInController();
  app.post('/api/V1/sign-in', ExpressRouteAdapter.adaptee(controller));
};
