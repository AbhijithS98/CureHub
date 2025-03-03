import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
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

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
    dob: {
      type: Date,
    },
    otp: {
      code: { type: Number, default: null },
      expiresAt: { type: Date, default: null },
    },
    pwResetToken: {
      type: String,
      default: null
    },
    pwTokenExpiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model<IUser>("User", userSchema);
export default User;
