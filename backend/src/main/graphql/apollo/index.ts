import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { GraphQLError } from 'graphql';
import { Server } from 'http';

import { baseResolver, loginResolver, notesResolver } from '../resolvers';
import { baseType, loginType, notesType } from '../type-defs';
import { authDirectiveTransformer } from '../directives';

const resolvers = [baseResolver, loginResolver, notesResolver];
const typeDefs = [baseType, loginType, notesType];

let schema = makeExecutableSchema({ resolvers, typeDefs });
schema = authDirectiveTransformer(schema);

const errors400 = [
  'InvalidEmailError',
  'InvalidIdError',
  'InvalidLastnameError',
  'InvalidNameError',
  'WeakPasswordError',
  'UnfinishedNoteError',
  'NoteNotFoundError',
];

const errors401 = ['TokenExpiredError', 'UserDoesNotExistsError'];

const errors403 = [
  'UserAlreadyExistsError',
  'PasswordDoesNotMatchError',
  'AccessDeniedError',
  'InvalidTokenSubjectError',
];

const errors500 = [
  'DatabaseError',
  'ActionNotRegisteredError',
  'InvalidSequencingDomainError',
];

const errors503 = ['ServiceUnavailableError'];

const handleErrors = (response: any, errors: readonly GraphQLError[]): void => {
  errors?.forEach(error => {
    response.data = undefined;

    if (errors400.some(value => value === error.extensions.name)) {
      response.http.status = 400;
    } else if (errors401.some(value => value === error.extensions.name)) {
      response.http.status = 401;
    } else if (errors403.some(value => value === error.extensions.name)) {
      response.http.status = 403;
    } else if (errors500.some(value => value === error.extensions.name)) {
      response.http.status = 500;
    } else if (errors503.some(value => value === error.extensions.name)) {
      response.http.status = 500;
    } else {
      response.http.status = 599;
    }
  });
};

export const setupApolloServer = (httpServer: Server): ApolloServer => {
  return new ApolloServer({
    schema,
    formatError: (formattedError, _error) => {
      return {
        message: formattedError.extensions.message as string,
        extensions: formattedError.extensions,
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        requestDidStart: async () => ({
          willSendResponse: async ({ response, errors }) =>
            handleErrors(response, errors),
        }),
      },
    ],
  });
};
