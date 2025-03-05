import { BaseRepository } from "./baseRepository.js";
import Review, { IReview } from "../models/reviewModel.js";
import { IReviewRepository } from "../interfaces/IReviewRepository.js";

class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
  constructor() {
    super(Review);
  }

  async createReview(newReview: Partial<IReview>): Promise<IReview> {
    return this.create(newReview); // Using BaseRepository method
  }

  async getReviews(doctorId: string): Promise<IReview[] | null> {
    return this.findAll(
      { doctorId },
      { populate: { path: "patientId", select: "name profilePicture" } } 
    );
  }
}

export default new ReviewRepository();
