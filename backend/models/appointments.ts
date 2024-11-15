import mongoose, { Schema, Document, Types } from 'mongoose';


export interface IAppointment extends Document {
  doctor: Types.ObjectId; 
  date: Date;
  timeSlots: {
    time: string; 
    isBooked: boolean; 
    user: Types.ObjectId | null; 
  }[]; 
}

// Appointment Schema 
const appointmentSchema = new Schema<IAppointment>({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
  date: { type: Date, required: true }, 
  timeSlots: [
    {
      time: { type: String, required: true }, 
      isBooked: { type: Boolean, default: false },
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, 
    },
  ],
});


const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
export default Appointment;
