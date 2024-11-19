import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IAppointment extends Document {
  doctor: Types.ObjectId; 
  date: Date;
  timeSlots: {
    time: string; 
    user: Types.ObjectId | null; 
    status: 'Pending' | 'Booked' | 'Completed';
    payment: Types.ObjectId | null;
    _id: Types.ObjectId; 
  }[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Appointment Schema 
const appointmentSchema = new Schema<IAppointment>({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
  date: { type: Date, required: true }, 
  timeSlots: [
      {
        time: { type: String, required: true }, 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
        status: { type: String, enum: ['Pending', 'Booked', 'Completed'], default: 'Pending' },
        payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
      },
    ],
  },
  { timestamps: true }
);


const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;
