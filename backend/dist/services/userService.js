var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import dotenv from 'dotenv';
import sendEmail from "../utils/emailSender.js";
dotenv.config();
class UserService {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield userRepository.findUserByEmail(userData.email);
            if (existingUser) {
                const error = Error("User already exists");
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(userData.password, salt);
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
            const newUserData = Object.assign(Object.assign({}, userData), { password: hashedPassword, otp: {
                    code: otpCode,
                    expiresAt: otpExpiresAt
                }, isVerified: false });
            const user = yield userRepository.createUser(newUserData);
            yield sendEmail({
                to: user.email,
                subject: "OTP Verification",
                text: `Your OTP for registration is ${otpCode}`,
            });
            return user;
        });
    }
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findUserByEmailAndOtp(email, Number(otp));
            if (!user || !user.otp || user.otp.expiresAt < new Date()) {
                return false;
            }
            return true;
        });
    }
    activateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userRepository.activateUser(email);
        });
    }
    updateOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpCode = Math.floor(100000 + Math.random() * 900000);
                const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
                yield userRepository.updateOtp(email, { code: otpCode, expiresAt: otpExpiresAt });
                yield sendEmail({
                    to: email,
                    subject: "OTP Verification",
                    text: `Your OTP for registration is ${otpCode}`,
                });
            }
            catch (error) {
                console.error('Error updating OTP:', error.message || error);
                throw new Error(error.message || 'Failed to update OTP.');
            }
        });
    }
    authenticateUser(email, password, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = yield userRepository.findUserByEmail(email);
            if (!User) {
                const error = Error('User not found');
                error.name = 'ValidationError';
                throw error;
            }
            const isPasswordMatch = yield bcrypt.compare(password, User.password);
            if (!isPasswordMatch) {
                const error = Error('Invalid credentials');
                error.name = 'ValidationError';
                throw error;
            }
            if (!User.isVerified) {
                const error = Error('Please verify your email before logging in.');
                error.name = 'ValidationError';
                throw error;
            }
            if (User.isBlocked) {
                const error = Error('Your account has been blocked. Please contact support.');
                error.name = 'ValidationError';
                throw error;
            }
            return User;
        });
    }
    clearCookie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('userRefreshJwt', '', {
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
            const user = yield userRepository.findUserByEmail(email);
            if (!user) {
                const error = Error('User not found');
                error.name = 'ValidationError';
                throw error;
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
            yield userRepository.updateResettoken(user.email, resetToken, tokenExpiry);
            const resetLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`;
            yield sendEmail({
                to: user.email,
                subject: 'Password Reset',
                html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`
            });
        });
    }
    resetPass(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userRepository.findUserByPwResetToken(token);
            if (!user) {
                const error = Error('Invalid or expired token');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            yield userRepository.updatePassword(token, hashedPassword);
        });
    }
    fetchDocSpecs() {
        return __awaiter(this, void 0, void 0, function* () {
            const Specializations = yield userRepository.getAllSpecializations();
            if (!Specializations) {
                const error = new Error("No Specializations  found");
                error.name = 'ValidationError';
                throw error;
            }
            return Specializations;
        });
    }
    fetchDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctors = yield userRepository.getAllDoctors();
            if (!Doctors) {
                const error = new Error("No doctors found");
                error.name = 'ValidationError';
                throw error;
            }
            return Doctors;
        });
    }
    getSingleDoc(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctor = yield userRepository.fetchSingleDoctor(email);
            if (!Doctor) {
                const error = new Error("No doctor with email found");
                error.name = 'ValidationError';
                throw error;
            }
            return Doctor;
        });
    }
    getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const User = yield userRepository.findUserByEmail(email);
            if (!User) {
                const error = Error('No User with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            return User;
        });
    }
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const User = yield userRepository.findUserByEmail(email);
            if (!User) {
                const error = Error('No User with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield userRepository.updateUserDetails(req);
        });
    }
    bookAppointment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slotId, timeSlotId, doctorId, amount } = req.body.bookingDetails;
            const UserId = req.user.Id;
            // Find the availability
            const availability = yield userRepository.findAvailability(slotId);
            if (!availability) {
                const error = Error('Slot has been removed or does not exist!');
                error.name = 'ValidationError';
                throw error;
            }
            // Find the time slot to update by timeSlotId
            const timeSlot = availability.timeSlots.find((slot) => slot._id.toString() === timeSlotId);
            if (!timeSlot) {
                const error = Error('Time slot has been removed!');
                error.name = 'ValidationError';
                throw error;
            }
            timeSlot.status = 'Booked';
            yield availability.save();
            const paymentObject = {
                user: UserId,
                doctor: doctorId,
                amount,
                method: 'Razorpay',
                status: 'Completed'
            };
            const payment = yield userRepository.createPayment(paymentObject);
            //create appointment
            const appointmentObject = {
                user: UserId,
                doctor: doctorId,
                date: availability.date,
                time: timeSlot.time,
                slotId,
                timeSlotId,
                payment: payment._id,
                status: 'Booked'
            };
            const appointment = yield userRepository.createAppointment(appointmentObject);
        });
    }
    getAppointments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const Appointments = yield userRepository.getUserAppointments(userId);
            if (!Appointments) {
                const error = Error('No Appointments for this user');
                error.name = 'ValidationError';
                throw error;
            }
            return Appointments;
        });
    }
    rechargeWallet(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            const UserId = req.user.Id;
            let Wallet = yield userRepository.findUserWallet(UserId);
            if (!Wallet) {
                const walletObject = {
                    ownerId: UserId,
                    ownerType: 'User',
                };
                Wallet = yield userRepository.createUserWallet(walletObject);
            }
            Wallet.balance += parseInt(amount);
            yield Wallet.save();
            const paymentObject = {
                user: UserId,
                amount,
                method: 'Razorpay',
                transactionType: 'Recharge',
                status: 'Completed'
            };
            yield userRepository.createPayment(paymentObject);
        });
    }
    getWallet(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserId = req.user.Id;
            const wallet = yield userRepository.findUserWallet(UserId);
            if (!wallet) {
                const error = Error('No wallet for this user');
                error.name = 'ValidationError';
                throw error;
            }
            return wallet;
        });
    }
}
export default new UserService();
