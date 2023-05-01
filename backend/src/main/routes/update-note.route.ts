import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeUpdateNoteController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeUpdateNoteController();
  app.put('/api/V1/update-note', ExpressRouteAdapter.adaptee(controller));
};
