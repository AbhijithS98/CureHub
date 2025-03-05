import { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
    findOne(filter: FilterQuery<T>): Promise<T | null>;
    findAll(
        filter?: FilterQuery<T>,
        options?: { 
            sort?: any; 
            limit?: number; 
            skip?: number; 
            projection?: any; 
            populate?: { path: string; select?: string } 
        }
    ): Promise<T[]>;

    create(data: Partial<T>): Promise<T>;

    update(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<number>;

    delete(filter: FilterQuery<T>): Promise<number>;
}
