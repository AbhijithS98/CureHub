import mongoose, { Document } from "mongoose";
import { IPopulatedUser } from "./IAppointmentPd";

export interface IReview extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId | IPopulatedUser;
  comment: string;
  rating: number;
  createdAt: Date;
}

