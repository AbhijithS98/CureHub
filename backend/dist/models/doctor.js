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
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true,
    },
    documents: {
        medicalDegree: {
            type: String,
            required: true
        },
        idProof: {
            type: String,
            required: true
        }
    },
    profilePicture: {
        type: String,
    },
    consultationFee: {
        type: Number,
    },
    bio: {
        type: String,
    },
    dob: {
        type: Date,
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
    ratingInfo: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    reviews: [
        {
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            review: { type: String },
            createdAt: { type: Date, default: Date.now },
        },
    ],
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
    availability: [
        {
            date: { type: Date },
            startTime: { type: String },
            endTime: { type: String }
        }
    ],
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
