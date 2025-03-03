var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class ReviewController {
    constructor(reviewService) {
        this.reviewService = reviewService;
    }
    createReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.reviewService.createReview(req);
                res.status(201).json({ message: "review added successfully." });
            }
            catch (error) {
                console.error("user adding review error: ", error.message);
                next(error);
            }
        });
    }
    getReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doctorId = req.query.doctorId;
                const reviews = yield this.reviewService.getReviews(doctorId);
                res.status(200).json({ reviews });
            }
            catch (error) {
                console.error('fetching doctor reviews: ', error);
                next(error);
            }
        });
    }
}
export default ReviewController;
