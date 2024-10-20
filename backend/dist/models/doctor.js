import mongoose, { Schema } from "mongoose";
const doctorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    specialization: {
        type: String,
    },
    medicalLicenseNumber: {
        type: String,
    },
    experience: {
        type: Number,
    },
    profileImageName: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    dob: {
        type: Date,
    },
    idProof: {
        type: String,
    },
    address: {
        clinicName: { type: String, default: '' },
        district: { type: String, default: '' },
        city: { type: String, default: '' }
    },
    otp: {
        code: { type: Number, default: null },
        expiresAt: { type: Date, default: null },
    },
    password: {
        type: String,
        required: true,
    },
    pwResetToken: {
        type: String,
        default: null
    },
    pwTokenExpiresAt: {
        type: Date,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
