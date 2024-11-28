import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId; 
  comment: string;
  rating: number;
  createdAt: Date;
}

const reviewSchema: Schema<IReview> = new Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", reviewSchema);
export default Review;
