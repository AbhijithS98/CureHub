import { IReview } from "../../models/reviewModel.js";
import { Request } from "express";

export interface IReviewService {
  createReview(req: Request): Promise<void>;
  getReviews(doctorId: string): Promise<IReview[] | null>;
}
