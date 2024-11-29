import mongoose, { Schema } from 'mongoose';
// Prescription Schema
const prescriptionSchema = new Schema({
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
}, { timestamps: true });
const Prescription = mongoose.model('Prescription', prescriptionSchema);
export default Prescription;
