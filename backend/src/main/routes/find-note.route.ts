import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeGetNoteController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeGetNoteController();
  app.get('/api/V1/find-note/:id', ExpressRouteAdapter.adaptee(controller));
};
