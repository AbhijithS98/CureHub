import { Document, Types } from "mongoose";

// Interface for the populated user field
export interface IPopulatedUser {
  _id: Types.ObjectId;
  name: string;
}

// Interface for the populated doctor field
export interface IPopulatedDoctor {
  _id: Types.ObjectId;
  name: string;
}

// Updated Appointment Interface
export interface IAppointmentPd extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | IPopulatedUser; // Can be either an ObjectId or populated object
  doctor: Types.ObjectId | IPopulatedDoctor; // Can be either an ObjectId or populated object
  date: Date;
  time: string;
  slotId: Types.ObjectId;
  timeSlotId: Types.ObjectId;
  payment: Types.ObjectId | null;
  status: "Booked" | "Cancelled" | "Completed";
  prescription: Types.ObjectId | null;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}