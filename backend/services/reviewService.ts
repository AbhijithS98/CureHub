import { Request } from "express";
import mongoose from "mongoose";
import { IReviewRepository } from "../interfaces/IReviewRepository.js";
import { IReviewService } from "./interfaces/IReviewService.js";
import { IDoctorRepository } from "../repositories/interfaces/IDoctorRepository.js";
import { IReview } from "../models/reviewModel.js";

class ReviewService implements IReviewService {
  private reviewRepository: IReviewRepository;
  private doctorRepository: IDoctorRepository;

  constructor(reviewRepository: IReviewRepository,doctorRepository:IDoctorRepository) {
    this.reviewRepository = reviewRepository;
    this.doctorRepository = doctorRepository;
  }


  async createReview(req: Request): Promise<void> {
    const { doctorId, rating, comment } = req.body;
    const UserId = req.user?.Id;
    
    if (!doctorId || !UserId || !rating || !comment) {
      const error = Error('All fields are required.');
      error.name = 'ValidationError';  
      throw error;
    }
  
    const newReview: Partial<IReview> = {
      doctorId,
      patientId: new mongoose.Types.ObjectId(UserId),
      comment,
      rating,
    };
    await this.reviewRepository.createReview(newReview);


    // Step 2: Fetch all reviews for the doctor
    const reviews = await this.reviewRepository.getReviews(doctorId);

    if (!reviews || reviews.length === 0) return;

    // Step 3: Calculate the new average rating and review count
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverage = totalRatings / reviews.length;

    console.log("New average rating: ", newAverage);

    // Step 4: Update the doctor's ratingInfo
    const doctor = await this.doctorRepository.findDoctorById(doctorId);
    if (!doctor) throw new Error("Doctor not found");

    doctor.ratingInfo.average = newAverage;
    doctor.ratingInfo.count = reviews.length;

    // Step 5: Save the updated doctor document
    await doctor.save();
  
  }

  async getReviews(doctorId: string): Promise<IReview[] | null> {
    console.log("came in rs............");
    const reviews = await this.reviewRepository.getReviews(doctorId);
    if(!reviews){
      console.log("no reviews............");
      
      const error = Error('No reviews for this doctor');
      error.name = 'ValidationError';  
      throw error;
    }
    console.log("reviews: ",reviews);
    
    return reviews
  }
}

export default ReviewService;
