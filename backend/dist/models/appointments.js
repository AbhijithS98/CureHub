import mongoose, { Schema } from 'mongoose';
// Appointment Schema 
const appointmentSchema = new Schema({
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
const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
