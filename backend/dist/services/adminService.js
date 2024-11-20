var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import adminRepository from "../repositories/adminRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
class AdminService {
    authenticateAdmin(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield adminRepository.findAdminByEmail(email);
            if (!admin) {
                const error = new Error("Admin not found with given email");
                error.name = 'ValidationError';
                throw error;
            }
            const isMatching = yield bcrypt.compare(password, admin.password);
            if (!isMatching) {
                const error = new Error("Incorrect password");
                error.name = 'ValidationError';
                throw error;
            }
            return admin;
        });
    }
    clearCookie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminRefreshJwt', '', {
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
            const admin = yield adminRepository.findAdminByEmail(email);
            if (!admin) {
                const error = Error('doctor not found');
                error.name = 'ValidationError';
                throw error;
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
            yield adminRepository.updateResettoken(admin.email, resetToken, tokenExpiry);
            const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;
            yield sendEmail({
                to: admin.email,
                subject: 'Password Reset',
                html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`
            });
        });
    }
    resetPass(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield adminRepository.findAdminByPwResetToken(token);
            if (!admin) {
                const error = Error('Invalid or expired token');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            yield adminRepository.updatePassword(token, hashedPassword);
        });
    }
    getDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctors = yield adminRepository.getAllDoctors();
            if (!Doctors) {
                const error = new Error("No doctors found");
                error.name = 'ValidationError';
                throw error;
            }
            return Doctors;
        });
    }
    getUnapprovedDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctors = yield adminRepository.getAllUnapprovedDoctors();
            if (!Doctors) {
                const error = new Error("No doctors found");
                error.name = 'ValidationError';
                throw error;
            }
            return Doctors;
        });
    }
    approveDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield adminRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = new Error("No doctor found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.approveDoc(email);
        });
    }
    rejectDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = yield adminRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = new Error("No doctor found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.deleteDoctor(email);
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const Users = yield adminRepository.getAllUsers();
            if (!Users) {
                const error = new Error("No Users found");
                error.name = 'ValidationError';
                throw error;
            }
            return Users;
        });
    }
    blockUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield adminRepository.findUserByEmail(email);
            if (!user) {
                const error = new Error("No user found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.blockUser(email);
        });
    }
    unblockUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield adminRepository.findUserByEmail(email);
            if (!user) {
                const error = new Error("No user found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.unblockUser(email);
        });
    }
    blockDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctor = yield adminRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = new Error("No Doctor found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.blockDoctor(email);
        });
    }
    unblockDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctor = yield adminRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = new Error("No Doctor found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.unblockDoctor(email);
        });
    }
    getAppointments() {
        return __awaiter(this, void 0, void 0, function* () {
            const Appointments = yield adminRepository.getAllAppointments();
            return Appointments;
        });
    }
}
export default new AdminService();
