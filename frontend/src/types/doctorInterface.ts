import { ObjectId } from "mongoose";

export interface IDoc {
  _id:ObjectId;
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: number;
  phone: string;
  gender: string;
  documents: {
    medicalDegree: string;
    idProof:string;
  };
  profilePicture?: string;
  consultationFee?: number;
  bio?: string;
  dob?: Date;
  address?: {
    clinicName: string;
    district: string;
    city: string;
  };
  otp?: {
    code: number;
    expiresAt: Date;
  };
  ratingInfo: {
    average: number; 
    count: number;  
  };
  reviews?: [
    {
      patientId: string; 
      comment: string;     
      createdAt: Date;    
    }
  ];
  password: string;
  pwResetToken?: string;
  pwTokenExpiresAt?: Date;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
}
