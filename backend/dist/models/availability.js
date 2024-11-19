import mongoose, { Schema } from 'mongoose';
// Appointment Schema 
const availabilitySchema = new Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    timeSlots: [
        {
            time: { type: String, required: true },
            status: { type: String, enum: ['Available', 'Booked'], default: 'Available', required: true },
        },
    ],
}, { timestamps: true });
const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
