import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeCreateNoteController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeCreateNoteController();
  app.post('/api/V1/create-note', ExpressRouteAdapter.adaptee(controller));
};
