var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./baseRepository.js";
import Review from "../models/reviewModel.js";
class ReviewRepository extends BaseRepository {
    constructor() {
        super(Review);
    }
    createReview(newReview) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(newReview); // Using BaseRepository method
        });
    }
    getReviews(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("came in rr............");
            console.log("doctorId type: ", typeof doctorId, "value:", doctorId);
            return this.findAll({ doctorId }, { populate: { path: "patientId", select: "name profilePicture" } });
        });
    }
}
export default new ReviewRepository();
