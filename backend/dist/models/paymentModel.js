import mongoose, { Schema } from 'mongoose';
const paymentSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    amount: { type: Number, required: true },
    appFee: { type: Number, default: 104 },
    method: { type: String, enum: ['Razorpay', 'Wallet'], required: true },
    transactionType: {
        type: String,
        enum: ['Booking', 'Recharge', 'Refund'],
        required: true,
    },
    status: { type: String, enum: ['Pending', 'Completed', 'Refunded'], default: 'Pending' },
}, { timestamps: true });
paymentSchema.index({ user: 1 });
paymentSchema.index({ doctor: 1 });
paymentSchema.index({ status: 1 });
const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
