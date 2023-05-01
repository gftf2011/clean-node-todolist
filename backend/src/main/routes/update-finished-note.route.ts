import { Express } from 'express';

import { ExpressRouteAdapter } from '../adapters';
import { makeUpdateFinishedNoteController } from '../factories/app/controllers';

export default (app: Express): void => {
  const controller = makeUpdateFinishedNoteController();
  app.patch(
    '/api/V1/update-finished-note',
    ExpressRouteAdapter.adaptee(controller),
  );
};
