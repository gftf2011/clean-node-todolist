import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeDeleteNoteController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeDeleteNoteController();
  app.delete('/api/V1/delete-note', ExpressRouteAdapter.adaptee(controller));
};
