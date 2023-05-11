import express from 'express';
import http, { Server } from 'http';
import setupMiddleware from './middlewares';
import setupMiddlewareGraphql from './middlewares-graphql';
import setupRoutest from './routes';

import { setupApolloServer } from '../graphql/apollo';

export const setupApp = async (): Promise<Server> => {
  const app = express();
  setupMiddleware(app);
  setupRoutest(app);
  const httpServer = http.createServer(app);
  const server = setupApolloServer(httpServer);
  await server.start();
  setupMiddlewareGraphql(app, server);

  return httpServer;
};

export default setupApp;
