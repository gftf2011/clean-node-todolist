import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';

import { GraphQLError, GraphQLSchema } from 'graphql';
import { makeAuthGraphqlMiddleware } from '../../factories/app/middlewares/graphql';
import { GraphqlRequest } from '../../../app/contracts/graphql';

export const authDirectiveTransformer = (
  schema: GraphQLSchema,
): GraphQLSchema => {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const authDirective = getDirective(schema, fieldConfig, 'auth')?.[0];
      if (authDirective) {
        const { resolve } = fieldConfig;
        // eslint-disable-next-line no-param-reassign
        fieldConfig.resolve = async (parent, args, context, info) => {
          const request: GraphqlRequest = {
            args,
            context,
          };
          try {
            const httpResponse = await makeAuthGraphqlMiddleware().handle(
              request,
            );
            if (httpResponse.statusCode === 200) {
              Object.assign(context?.req?.headers, httpResponse.body);
              return resolve.call(this, parent, args, context, info);
            }
            throw httpResponse.body;
          } catch (err) {
            const error: Error = err as any;
            throw new GraphQLError(error.message, {
              extensions: {
                name: error.name,
                message: error.message,
              },
            });
          }
        };
      }
      return fieldConfig;
    },
  });
};
