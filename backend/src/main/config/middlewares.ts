import { Express } from 'express';

import { readdirSync } from 'fs';

export default (app: Express): void => {
  readdirSync(`${__dirname}/../middlewares`).map(async file => {
    (await import(`${__dirname}/../middlewares/${file}`)).default(app);
  });
};
