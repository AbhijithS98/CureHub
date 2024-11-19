import { Document, Types } from 'mongoose';


export interface IWallet extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId; 
  ownerType: 'User' | 'Doctor';
  balance: number;
}