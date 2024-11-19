import mongoose, { Schema } from 'mongoose';
const paymentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Razorpay', 'Wallet'], required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
}, { timestamps: true });
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
