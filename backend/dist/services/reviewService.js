var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
class ReviewService {
    constructor(reviewRepository, doctorRepository) {
        this.reviewRepository = reviewRepository;
        this.doctorRepository = doctorRepository;
    }
    createReview(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { doctorId, rating, comment } = req.body;
            const UserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.Id;
            if (!doctorId || !UserId || !rating || !comment) {
                const error = Error('All fields are required.');
                error.name = 'ValidationError';
                throw error;
            }
            const newReview = {
                doctorId,
                patientId: new mongoose.Types.ObjectId(UserId),
                comment,
                rating,
            };
            yield this.reviewRepository.createReview(newReview);
            // Step 2: Fetch all reviews for the doctor
            const reviews = yield this.reviewRepository.getReviews(doctorId);
            if (!reviews || reviews.length === 0)
                return;
            // Step 3: Calculate the new average rating and review count
            const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
            const newAverage = totalRatings / reviews.length;
            console.log("New average rating: ", newAverage);
            // Step 4: Update the doctor's ratingInfo
            const doctor = yield this.doctorRepository.findDoctorById(doctorId);
            if (!doctor)
                throw new Error("Doctor not found");
            doctor.ratingInfo.average = newAverage;
            doctor.ratingInfo.count = reviews.length;
            // Step 5: Save the updated doctor document
            yield doctor.save();
        });
    }
    getReviews(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviews = yield this.reviewRepository.getReviews(doctorId);
            if (!reviews) {
                const error = Error('No reviews for this doctor');
                error.name = 'ValidationError';
                throw error;
            }
            return reviews;
        });
    }
}
export default ReviewService;
