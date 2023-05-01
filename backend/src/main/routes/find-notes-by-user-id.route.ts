import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeGetNotesByUserIdController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeGetNotesByUserIdController();
  app.get('/api/V1/find-note/:userId', ExpressRouteAdapter.adaptee(controller));
};
