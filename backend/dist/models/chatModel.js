import mongoose, { Schema } from "mongoose";
const chatSchema = new Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isDoctorSender: { type: Boolean, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
