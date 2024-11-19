import mongoose, { Schema } from 'mongoose';
// Appointment Schema
const appointmentSchema = new Schema({
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
}, { timestamps: true });
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
