import mongoose, { Document, Schema } from "mongoose";


export interface IAdmin extends Document {
  email: string;
  password: string;
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
});


const Admin = mongoose.model<IAdmin>("Admin", adminSchema, "admins");

export default Admin;
