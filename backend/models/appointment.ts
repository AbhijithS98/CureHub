import mongoose, { Schema, Document, Types } from 'mongoose';
import { IPayment } from './paymentSchema';


export enum CancellationReason {
  MedicalEmergency = 'Medical Emergency',
  HealthIssues = 'Health Issues',
  OperationalIssues = 'Operational Issues',
}

// Appointment interface
export interface IAppointment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId; 
  doctor: Types.ObjectId; 
  date: Date; 
  time: string; 
  slotId: Types.ObjectId; 
  timeSlotId: Types.ObjectId; 
  payment: IPayment | Types.ObjectId | null; 
  status: 'Booked' | 'Cancelled' | 'Completed'; 
  cancellationReason?: string;
  createdAt: Date; 
  updatedAt: Date;
}

// Appointment Schema
const appointmentSchema = new Schema<IAppointment>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Availability', required: true },
    timeSlotId: { type: mongoose.Schema.Types.ObjectId, required: true },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    status: {
      type: String,
      enum: ['Booked', 'Cancelled', 'Completed'],
      default: 'Booked',
      required: true,
    },
    cancellationReason: {
      type: String,
      enum: [
        'Medical Emergency',
        'Health Issues',
        'Operational Issues',
      ], 
      required: false, 
    },
  },
  { timestamps: true }
);


const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;
