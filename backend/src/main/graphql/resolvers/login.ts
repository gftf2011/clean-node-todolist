import { ApolloServerResolverAdapter } from '../../adapters';
import {
  makeSignUpGraphqlController,
  makeSignInGraphqlController,
} from '../../factories/app/controllers/graphql';

export const loginResolver = {
  Query: {
    signIn: ApolloServerResolverAdapter.adaptee(makeSignInGraphqlController()),
  },

  Mutation: {
    signUp: ApolloServerResolverAdapter.adaptee(makeSignUpGraphqlController()),
  },
};
