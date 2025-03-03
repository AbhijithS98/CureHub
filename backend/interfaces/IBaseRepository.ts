export interface IBaseRepository<T> {
  findOne(filter: any): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(filter: any, updateData: Partial<T>): Promise<void>;
  delete(filter: any): Promise<void>;
}
