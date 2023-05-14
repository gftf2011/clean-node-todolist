import { ApolloServerResolverAdapter } from '../../adapters';
import {
  makeCreateNoteGraphqlController,
  makeDeleteNoteGraphqlController,
  makeGetNoteGraphqlController,
  makeGetNotesByUserIdGraphqlController,
  makeUpdateFinishedNoteGraphqlController,
  makeUpdateNoteGraphqlController,
} from '../../factories/app/controllers/graphql';

export default {
  Query: {
    getNote: ApolloServerResolverAdapter.adaptee(
      makeGetNoteGraphqlController(),
    ),

    getNotesByUserId: ApolloServerResolverAdapter.adaptee(
      makeGetNotesByUserIdGraphqlController(),
    ),
  },

  Mutation: {
    updateNote: ApolloServerResolverAdapter.adaptee(
      makeUpdateNoteGraphqlController(),
    ),

    updateFinishedNote: ApolloServerResolverAdapter.adaptee(
      makeUpdateFinishedNoteGraphqlController(),
    ),

    createNote: ApolloServerResolverAdapter.adaptee(
      makeCreateNoteGraphqlController(),
    ),

    deleteNote: ApolloServerResolverAdapter.adaptee(
      makeDeleteNoteGraphqlController(),
    ),
  },
};
