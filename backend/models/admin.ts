import mongoose, { Document, Schema } from "mongoose";


export interface IAdmin extends Document {
  email: string;
  password: string;
  pwResetToken?: string;
  pwTokenExpiresAt?: Date;
}


const adminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pwResetToken: {
    type: String,
    default: null
  },
  pwTokenExpiresAt: {
    type: Date,
    default: null
  },
});


const Admin = mongoose.model<IAdmin>("Admin", adminSchema, "admins");

export default Admin;
