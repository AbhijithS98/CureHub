import { NextFunction, Request, Response } from "express";
import { IReviewService } from "../services/interfaces/IReviewService.js";

class ReviewController {
  private reviewService: IReviewService;

  constructor(reviewService: IReviewService) {
    this.reviewService = reviewService;
  }

  async createReview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.reviewService.createReview(req);
      res.status(201).json({ message: "review added successfully."});
    } catch (error: any) {
      console.error("user adding review error: ", error.message);
      next(error);
    }
  }

  async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = req.query.doctorId as string;
      const reviews = await this.reviewService.getReviews(doctorId);
      res.status(200).json({reviews});
    } catch (error: any) {
      console.error('fetching doctor reviews: ', error);
      next(error);
    }
  }
}

export default ReviewController;
