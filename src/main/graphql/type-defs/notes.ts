export default `#graphql
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

  type PaginatedNotes {
    notes: [Note]
    previous: Boolean
    next: Boolean
  }

  extend type Query {
    getNote (input: GetNoteInput): Note @auth
  }

  input GetNotesByUserIdInput {
    page: Int
    limit: Int
  }

  type GetNotesByUserIdOutput {
    paginatedNotes: PaginatedNotes
  }

  extend type Query {
    getNotesByUserId (input: GetNotesByUserIdInput): GetNotesByUserIdOutput @auth
  }

  input UpdateNoteInput {
    id: String
    title: String
    description: String
  }

  extend type Mutation {
    updateNote (input: UpdateNoteInput): Note @auth
  }

  input UpdateFinishedNoteInput {
    id: String
    finished: Boolean
  }

  extend type Mutation {
    updateFinishedNote (input: UpdateFinishedNoteInput): Note @auth
  }

  input CreateNoteInput {
    title: String
    description: String
  }

  extend type Mutation {
    createNote (input: CreateNoteInput): Note @auth
  }

  input DeleteNoteInput {
    id: String
  }

  extend type Mutation {
    deleteNote (input: DeleteNoteInput): Void @auth
  }
`;
