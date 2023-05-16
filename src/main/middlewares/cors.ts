import { Express, NextFunction, Request, Response } from 'express';

export default (app: Express) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.set('access-control-allow-origin', process.env.ORIGIN);
    res.set('access-control-allow-headers', '*');
    res.set('access-control-allow-methods', '*');
    next();
  });
};
