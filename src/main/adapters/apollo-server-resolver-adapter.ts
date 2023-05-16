import { GraphQLError } from 'graphql';

import { Controller } from '../../app/contracts/controllers';

type Adapter = (parent?: any, args?: any, context?: any) => Promise<any>;

export class ApolloServerResolverAdapter {
  static adaptee(controller: Controller): Adapter {
    return async (_parent?: any, args?: any, context?: any): Promise<any> => {
      const request = {
        args,
        context,
      };
      const httpResponse = await controller.handle(request);
      if (
        httpResponse.statusCode === 200 ||
        httpResponse.statusCode === 201 ||
        httpResponse.statusCode === 204
      ) {
        return httpResponse.body;
      }
      throw new GraphQLError(httpResponse.body.message, {
        extensions: {
          name: httpResponse.body.name,
          message: httpResponse.body.message,
        },
      });
    };
  }
}
