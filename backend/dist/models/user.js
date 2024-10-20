import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageName: {
        type: String,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        default: '',
    },
    dob: {
        type: Date,
    },
    otp: {
        code: { type: Number, default: null },
        expiresAt: { type: Date, default: null },
    },
    pwResetToken: {
        type: String,
        default: null
    },
    pwTokenExpiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
});
const User = mongoose.model("User", userSchema);
export default User;
