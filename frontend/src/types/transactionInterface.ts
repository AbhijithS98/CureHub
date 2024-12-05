import {Document, Types } from 'mongoose';

interface populatedDoc {
  _id: string,
  consultationFee: number
}

export interface Itransaction extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  doctor?: Types.ObjectId | populatedDoc;
  amount: number;
  appFee: number;
  method: 'Razorpay' | 'Wallet';
  transactionType: 'Booking' | 'Recharge' | 'Refund';
  status: 'Pending' | 'Completed' | 'Refunded';
  createdAt: Date;
  updatedAt: Date;
}