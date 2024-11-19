import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPayment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
  method: 'Razorpay' | 'Wallet';
  status: 'Pending' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['Razorpay', 'Wallet'], required: true },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;
