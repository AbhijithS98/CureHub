import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
  doctorId: mongoose.Types.ObjectId; 
  patientId: mongoose.Types.ObjectId; 
  message: string;
  isDoctorSender: boolean;
  isRead: boolean;
  createdAt: Date; 
}

const chatSchema: Schema<IChat> = new Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isDoctorSender: { type: Boolean, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } 
);


const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
