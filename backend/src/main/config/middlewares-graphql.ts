import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

export default (app: Express, server: ApolloServer) => {
  app.use('/graphql', expressMiddleware(server));
};
