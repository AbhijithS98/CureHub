import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAvailability extends Document {
  doctor: Types.ObjectId; 
  date: Date;
  timeSlots: {
    time: string;  
    status: 'Available' | 'Booked' ;
    _id: Types.ObjectId; 
  }[]; 
  createdAt: Date;
  updatedAt: Date;
}

// Appointment Schema 
const availabilitySchema = new Schema<IAvailability>(
  {
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true }, 
    date: { type: Date, required: true }, 
    timeSlots: [
        {
          time: { type: String, required: true }, 
          status: { type: String, enum: ['Available', 'Booked'], default: 'Available', required: true },
        },
      ],
  },
  { timestamps: true }
);


const Availability = mongoose.model<IAvailability>('Availability', availabilitySchema);
export default Availability;
