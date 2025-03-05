// // baseRepository.ts
// import { Model, Document, FilterQuery } from "mongoose";
// import { IBaseRepository } from "../interfaces/IBaseRepository.js";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    findOne(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.findOne(filter);
            }
            catch (error) {
                console.error("Error in findOne:", error);
                throw new Error("Database error");
            }
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, options = {}) {
            try {
                let query = this.model.find(filter, options.projection || {});
                if (options.sort)
                    query = query.sort(options.sort);
                if (options.limit)
                    query = query.limit(options.limit);
                if (options.skip)
                    query = query.skip(options.skip);
                if (options.populate)
                    query = query.populate(options.populate);
                return yield query;
            }
            catch (error) {
                console.error("Error in findAll:", error);
                throw new Error("Database error");
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.create(data);
            }
            catch (error) {
                console.error("Error in create:", error);
                throw new Error("Database error");
            }
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.updateOne(filter, { $set: updateData });
                return result.modifiedCount;
            }
            catch (error) {
                console.error("Error in update:", error);
                throw new Error("Database error");
            }
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.deleteOne(filter);
                return result.deletedCount;
            }
            catch (error) {
                console.error("Error in delete:", error);
                throw new Error("Database error");
            }
        });
    }
}
