import {Document, Types } from 'mongoose';

export interface Itransaction extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  doctor?: Types.ObjectId;
  amount: number;
  method: 'Razorpay' | 'Wallet';
  transactionType: 'Booking' | 'Recharge' | 'Refund';
  status: 'Pending' | 'Completed' | 'Refunded';
  createdAt: Date;
  updatedAt: Date;
}