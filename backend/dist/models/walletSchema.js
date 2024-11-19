import mongoose, { Schema } from 'mongoose';
// Wallet schema
const walletSchema = new Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ownerType: { type: String, enum: ['User', 'Doctor'], required: true },
    balance: { type: Number, default: 0, required: true },
}, {
    timestamps: true,
});
walletSchema.index({ ownerId: 1, ownerType: 1 });
const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
