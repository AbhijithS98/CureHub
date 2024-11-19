import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IWallet extends Document {
  _id: Types.ObjectId;
  ownerId: Types.ObjectId; 
  ownerType: 'User' | 'Doctor';
  balance: number;
}

// Wallet schema
const walletSchema = new Schema<IWallet>(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ownerType: { type: String, enum: ['User', 'Doctor'], required: true },
    balance: { type: Number, default: 0, required: true },
  },
  {
    timestamps: true, 
  }
);


walletSchema.index({ ownerId: 1, ownerType: 1 });


const Wallet = mongoose.model<IWallet>('Wallet', walletSchema);
export default Wallet;
