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
    console.log("came in rr............");
    console.log("doctorId type: ", typeof doctorId, "value:", doctorId);
    
    return this.findAll(
      { doctorId },
      { populate: { path: "patientId", select: "name profilePicture" } } 
    );
  }
}

export default new ReviewRepository();
