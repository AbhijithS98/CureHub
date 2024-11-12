var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import doctorRepository from "../repositories/doctorRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
class DoctorService {
    registerDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            const { email, password } = formData;
            const existingDoctor = yield doctorRepository.findDoctorByEmail(email);
            if (existingDoctor) {
                const error = Error("Doctor already exists");
                error.name = 'ValidationError';
                throw error;
            }
            const idProofPath = req.files ? req.files['idProof'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;
            const medicalDegreePath = req.files ? req.files['medicalDegree'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;
            const profilePicturePath = req.files ? req.files['profilePicture'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;
            if (!idProofPath || !medicalDegreePath || !profilePicturePath) {
                const error = Error('All files (ID proof, Medical Degree, profilePicture) are required');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
            const newDoctorData = Object.assign(Object.assign({}, formData), { password: hashedPassword, profilePicture: profilePicturePath, otp: {
                    code: otpCode,
                    expiresAt: otpExpiresAt
                }, documents: {
                    idProof: idProofPath,
                    medicalDegree: medicalDegreePath,
                }, isVerified: false });
            const doctor = yield doctorRepository.createDoctor(newDoctorData);
            yield sendEmail({
                to: doctor.email,
                subject: "OTP Verification",
                text: `Your OTP for registration is ${otpCode}`,
            });
            return doctor;
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorRepository.findDoctorByEmailAndOtp(email, Number(otp));
            if (!doctor || !doctor.otp || doctor.otp.expiresAt < new Date()) {
                return false;
            }
            return true;
        });
    }
    markVerifiedDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield doctorRepository.markVerifiedDoctor(email);
        });
    }
    updateOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpCode = Math.floor(100000 + Math.random() * 900000);
                const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
                yield doctorRepository.updateOtp(email, { code: otpCode, expiresAt: otpExpiresAt });
                yield sendEmail({
                    to: email,
                    subject: "OTP Verification",
                    text: `Your OTP for doctor registration is ${otpCode}`,
                });
            }
            catch (error) {
                console.error('Error updating OTP:', error.message || error);
                throw new Error(error.message || 'Failed to update OTP.');
            }
        });
    }
    authenticateDoctor(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = Error('Doctor not found');
                error.name = 'ValidationError';
                throw error;
            }
            const isPasswordMatch = yield bcrypt.compare(password, doctor.password);
            if (!isPasswordMatch) {
                const error = Error('Invalid credentials');
                error.name = 'ValidationError';
                throw error;
            }
            if (!doctor.isVerified) {
                const error = Error('Please verify your email before logging in.');
                error.name = 'ValidationError';
                throw error;
            }
            if (!doctor.isApproved) {
                const error = Error('You are not Approved by the admin yet!');
                error.name = 'ValidationError';
                throw error;
            }
            if (doctor.isBlocked) {
                const error = Error('Your account has been blocked. Please contact support.');
                error.name = 'ValidationError';
                throw error;
            }
            return doctor;
        });
    }
    clearCookie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('doctorRefreshJwt', '', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV !== 'development',
                    sameSite: 'strict',
                    expires: new Date(0),
                });
            }
            catch (error) {
                throw new Error('Error clearing cookies');
            }
        });
    }
    sendResetLink(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = Error('doctor not found');
                error.name = 'ValidationError';
                throw error;
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
            yield doctorRepository.updateResettoken(doctor.email, resetToken, tokenExpiry);
            const resetLink = `${process.env.FRONTEND_URL}/doctor/reset-password?token=${resetToken}`;
            yield sendEmail({
                to: doctor.email,
                subject: 'Password Reset',
                html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`
            });
        });
    }
    resetPass(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield doctorRepository.findDoctorByPwResetToken(token);
            if (!doctor) {
                const error = Error('Invalid or expired token');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            yield doctorRepository.updatePassword(token, hashedPassword);
        });
    }
    getDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctor = yield doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            return Doctor;
        });
    }
    updateDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const Doctor = yield doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield doctorRepository.updateDoctorDetails(req);
        });
    }
    updateSlots(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.query;
            const { newSlots } = req.body;
            console.log("slots are: ", newSlots);
            const Doctor = yield doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield doctorRepository.addSlots(email, newSlots);
        });
    }
    removeSlot(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slotId, docEmail } = req.body;
            console.log("slotId: ", slotId, "docEmail: ", docEmail);
            const Doctor = yield doctorRepository.findDoctorByEmail(docEmail);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield doctorRepository.deleteSlot(docEmail, slotId);
        });
    }
}
export default new DoctorService();
