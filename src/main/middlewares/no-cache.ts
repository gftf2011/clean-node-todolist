import { Request, Response, NextFunction, Express } from 'express';

export default (app: Express) => {
  app.use((_req: Request, res: Response, next: NextFunction) => {
    res.set(
      'cache-control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.set('pragma', 'no-cache');
    res.set('expires', '0');
    res.set('surrogate-control', 'no-store');
    next();
  });
};
