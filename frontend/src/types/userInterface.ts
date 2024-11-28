import { Document } from "mongoose";


export interface Iuser extends Document{
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  address?: string;
  dob?: Date;
  otp?: {
    code: number;
    expiresAt: Date;
  };
  pwResetToken?: string;
  pwTokenExpiresAt?: Date;
}