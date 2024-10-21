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
class DoctorService {
    registerDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const formData = req.body;
            const { email, password } = formData;
            const existingDoctor = yield doctorRepository.findDoctorByEmail(email);
            if (existingDoctor) {
                const error = Error("Doctor already exists");
                error.name = 'ValidationError';
                throw error;
            }
            const idProofPath = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
            if (!idProofPath) {
                const error = Error('ID proof is required');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
            const newDoctorData = Object.assign(Object.assign({}, formData), { password: hashedPassword, otp: {
                    code: otpCode,
                    expiresAt: otpExpiresAt
                }, idProof: idProofPath, isVerified: false });
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
}
export default new DoctorService();
