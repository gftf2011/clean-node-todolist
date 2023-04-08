export interface Repository<T> {
  save(value: T): Promise<void>;
  update(value: T): Promise<void>;
  delete(id: string): Promise<void>;
  find(id: string): Promise<T>;
  findAll(page: number, limit: number): Promise<T[]>;
}
