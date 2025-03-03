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
            return this.model.findOne(filter);
        });
    }
    findAll() {
        return __awaiter(this, arguments, void 0, function* (filter = {}, options = {}) {
            let query = this.model.find(filter, options.projection || {});
            if (options.sort)
                query = query.sort(options.sort);
            if (options.limit)
                query = query.limit(options.limit);
            if (options.skip)
                query = query.skip(options.skip);
            if (options.populate)
                query = query.populate(options.populate);
            return query;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.create(data);
        });
    }
    update(filter, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.updateOne(filter, updateData);
        });
    }
    delete(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteOne(filter);
        });
    }
}
