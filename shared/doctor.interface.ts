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
    medicalLicense: string;
    medicalDegree: string;
    idProof:string;
  };
  password: string;
  pwResetToken?: string;
  pwTokenExpiresAt?: Date;
  isVerified: boolean;
  isApproved: boolean;
  isBlocked: boolean;
}