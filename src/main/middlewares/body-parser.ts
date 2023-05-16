import { Express, json } from 'express';

export default (app: Express) => {
  app.use(json());
};
