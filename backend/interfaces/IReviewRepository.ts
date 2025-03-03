import { IReview } from "../models/reviewModel.js";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IReviewRepository extends IBaseRepository<IReview> {
  createReview(newReview: Partial<IReview>): Promise<IReview>;
  getReviews(doctorId: string): Promise<IReview[] | null>;
}
