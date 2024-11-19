import mongoose, { Schema } from 'mongoose';
// Appointment Schema 
const appointmentSchema = new Schema({
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
}, { timestamps: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
