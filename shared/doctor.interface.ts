import { ObjectId } from "mongoose";

export interface IDoctor {
  _id:ObjectId;
  name: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string;
  experience: number;
  profileImageName?: string;
  phone: string;
  dob?: Date;
  idProof: string;
  address?: {
    clinicName: string;
    district: string;
    city: string;
  };
  otp?: {
    code: number;
    expiresAt: Date;
  };
  password: string;
  pwResetToken?: string;
  pwTokenExpiresAt?: Date;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
}