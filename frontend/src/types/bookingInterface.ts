import { ObjectId } from 'mongoose';

export interface Ibooking {
  _id: ObjectId;
  user: ObjectId;
  doctor: {name:string}; 
  date: Date; 
  time: string; 
  slotId: ObjectId; 
  timeSlotId: ObjectId; 
  payment: ObjectId | null; 
  status: 'Booked' | 'Cancelled' | 'Completed'; 
  cancellationReason?: string;
  createdAt: Date; 
  updatedAt: Date;
}