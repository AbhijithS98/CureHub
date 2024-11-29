import mongoose, { Schema, Document, Types } from 'mongoose';

// Prescription interface
export interface IPrescription extends Document {
  _id: Types.ObjectId;
  appointment: Types.ObjectId;
  doctor: Types.ObjectId; 
  patient: Types.ObjectId;
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string; // e.g., '7 days', '2 weeks'
  }[];
  advice?: string; // General advice or follow-up instructions
  createdAt: Date;
  updatedAt: Date;
}

// Prescription Schema
const prescriptionSchema = new Schema<IPrescription>(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    diagnosis: { type: String },
    medications: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true }, // e.g., '500mg'
        frequency: { type: String, required: true }, // e.g., 'Twice a day'
        duration: { type: String, required: true }, // e.g., '7 days'
        notes: { type: String },
      },
    ],
    advice: { type: String },
  },
  { timestamps: true }
);

const Prescription = mongoose.model<IPrescription>('Prescription', prescriptionSchema);
export default Prescription;
