export interface DatabaseConnection {
  connect: (config: any) => Promise<void>;
  disconnect: () => Promise<void>;
  getConnection: () => Promise<any>;
}

export interface DatabaseQuery {
  query: (input: any) => Promise<any>;
}

export interface DatabaseTransaction extends DatabaseQuery {
  openTransaction: () => Promise<void>;
  closeTransaction: () => Promise<void>;
  createClient: () => Promise<void>;
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
  close: () => Promise<void>;
}
