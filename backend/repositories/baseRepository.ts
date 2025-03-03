// baseRepository.ts
import { Model, Document } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository.js";

export class BaseRepository<T extends Document> implements IBaseRepository<T> {
    constructor(protected model: Model<T>) {}

    async findOne(filter: any): Promise<T | null> {
        return this.model.findOne(filter);
    }

    async findAll(filter: any = {}, options: { sort?: any; limit?: number; skip?: number; projection?: any } = {}): Promise<T[]> {
        let query = this.model.find(filter, options.projection || {});
      
        if (options.sort) query = query.sort(options.sort);
        if (options.limit) query = query.limit(options.limit);
        if (options.skip) query = query.skip(options.skip);
      
        return query;
    }
      

    async create(data: Partial<T>): Promise<T> {
        return this.model.create(data);
    }

    async update(filter: any, updateData: Partial<T>): Promise<void> {
        await this.model.updateOne(filter, updateData);
    }

    async delete(filter: any): Promise<void> {
        await this.model.deleteOne(filter);
    }
}