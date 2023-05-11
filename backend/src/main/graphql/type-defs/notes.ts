export const notesType = `#graphql
  input GetNoteInput {
    id: String
  }

  type Note {
    id: String
    title: String
    description: String
    timestamp: String
    finished: Boolean
  }

  extend type Query {
    getNote (input: GetNoteInput): Note @auth
  }

  type GetNotesByUserIdOutput {
    notes: [Note]
  }

  extend type Query {
    getNotesByUserId: GetNotesByUserIdOutput @auth
  }

  input UpdateNoteInput {
    id: String
    title: String
    description: String
  }

  extend type Mutation {
    updateNote (input: UpdateNoteInput): Void @auth
  }

  input UpdateFinishedNoteInput {
    id: String
    finished: Boolean
  }

  extend type Mutation {
    updateFinishedNote (input: UpdateFinishedNoteInput): Void @auth
  }

  input CreateNoteInput {
    title: String
    description: String
  }

  type CreateNoteOutput {
    created: Boolean
  }

  extend type Mutation {
    createNote (input: CreateNoteInput): CreateNoteOutput @auth
  }

  input DeleteNoteInput {
    id: String
  }

  extend type Mutation {
    deleteNote (input: DeleteNoteInput): Void @auth
  }
`;
