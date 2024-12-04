import { ObjectId } from 'mongoose';


export interface UPscreenPopulatedUser{
  _id:string,
  name:string,
  profilePicture:string
}

export interface UPscreenPopulatedDoctor{
  _id:string,
  name:string,
  profilePicture:string
}

export interface Ibooking {
  _id: ObjectId;
  user: UPscreenPopulatedUser;
  doctor: UPscreenPopulatedDoctor; 
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