import mongoose, { Document, Schema } from "mongoose";

// interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  profileImageName?: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  address?: string;
  dob?: Date;
}

// Create the user schema
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
    profileImageName: {
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
  },
  {
    timestamps: true,
  }
);

// Create the User model
const User = mongoose.model<IUser>("User", userSchema);
export default User;
