// // baseRepository.ts
// import { Model, Document, FilterQuery } from "mongoose";
// import { IBaseRepository } from "../interfaces/IBaseRepository.js";

// export class BaseRepository<T extends Document> implements IBaseRepository<T> {
//     constructor(protected model: Model<T>) {}

//     async findOne(filter: FilterQuery<T>): Promise<T | null> {
//         return this.model.findOne(filter);
//     }

//     async findAll(
//         filter: any = {},
//         options: { sort?: any; limit?: number; skip?: number; projection?: any; populate?: { path: string; select?: string } } = {}
//     ): Promise<T[]> {
//         let query = this.model.find(filter, options.projection || {});
      
//         if (options.sort) query = query.sort(options.sort);
//         if (options.limit) query = query.limit(options.limit);
//         if (options.skip) query = query.skip(options.skip);
//         if (options.populate) query = query.populate(options.populate);
      
//         return query;
//     }
      

//     async create(data: Partial<T>): Promise<T> {
//         return this.model.create(data);
//     }

//     async update(filter: any, updateData: Partial<T>): Promise<void> {
//         await this.model.updateOne(filter, updateData);
//     }

//     async delete(filter: any): Promise<void> {
//         await this.model.deleteOne(filter);
//     }
// }



import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";
import { IBaseRepository } from "../interfaces/IBaseRepository.js";

export class BaseRepository<T extends Document & { _id: any }> implements IBaseRepository<T> {
    constructor(protected model: Model<T>) {}

    async findOne(filter: FilterQuery<T>): Promise<T | null> {
        try {
            return await this.model.findOne(filter);
        } catch (error) {
            console.error("Error in findOne:", error);
            throw new Error("Database error");
        }
    }

    async findAll(
        filter: FilterQuery<T> = {},
        options: { sort?: any; limit?: number; skip?: number; projection?: any; populate?: { path: string; select?: string } } = {}
    ): Promise<T[]> {
        try {
            let query = this.model.find(filter, options.projection || {});

            if (options.sort) query = query.sort(options.sort);
            if (options.limit) query = query.limit(options.limit);
            if (options.skip) query = query.skip(options.skip);
            if (options.populate) query = query.populate(options.populate);

            return await query;
        } catch (error) {
            console.error("Error in findAll:", error);
            throw new Error("Database error");
        }
    }

    async create(data: Partial<T>): Promise<T> {
        try {
            return await this.model.create(data);
        } catch (error) {
            console.error("Error in create:", error);
            throw new Error("Database error");
        }
    }

    async update(filter: FilterQuery<T>, updateData: UpdateQuery<T>): Promise<number> {
        try {
            const result = await this.model.updateOne(filter, { $set: updateData }); 
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in update:", error);
            throw new Error("Database error");
        }
    }

    async delete(filter: FilterQuery<T>): Promise<number> {
        try {
            const result = await this.model.deleteOne(filter);
            return result.deletedCount;
        } catch (error) {
            console.error("Error in delete:", error);
            throw new Error("Database error");
        }
    }
}
