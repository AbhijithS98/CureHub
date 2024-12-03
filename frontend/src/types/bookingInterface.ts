import { ObjectId } from 'mongoose';

export interface Ibooking {
  _id: ObjectId;
  user: string;
  doctor: {_id:string,name:string}; 
  date: Date; 
  time: string; 
  slotId: ObjectId; 
  timeSlotId: ObjectId; 
  payment: ObjectId | null; 
  status: 'Booked' | 'Cancelled' | 'Completed'; 
  prescription?: ObjectId;
  cancellationReason?: string;
  createdAt: Date; 
  updatedAt: Date;
}