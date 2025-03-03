import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  doctor?: Types.ObjectId;
  amount: number;
  appFee: number;
  method: 'Razorpay' | 'Wallet';
  transactionType: 'Booking' | 'Recharge' | 'Refund';
  status: 'Pending' | 'Completed' | 'Refunded';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
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
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ doctor: 1 });
paymentSchema.index({ status: 1 });

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
