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
import Doctor from "../models/doctor.js";
import sendEmail from "../utils/emailSender.js";
import { GoogleTokenVerify } from "../utils/googleTokenVerify.js";
dotenv.config();
class UserService {
    registerUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const formData = req.body;
            const existingUser = yield userRepository.findUserByEmail(formData.email);
            if (existingUser) {
                const error = Error("User already exists");
                error.name = 'ValidationError';
                throw error;
            }
            const profilePicturePath = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace(/\\/g, "/").replace(/^public\//, "")) !== null && _b !== void 0 ? _b : null;
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(formData.password, salt);
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
            const newUserData = Object.assign(Object.assign({}, formData), { profilePicture: profilePicturePath, password: hashedPassword, otp: {
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
    updateUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const formData = req.body;
            const User = yield userRepository.findUserByEmail(formData.email);
            if (!User) {
                const error = Error('No User with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            const profilePicturePath = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path.replace(/\\/g, "/").replace(/^public\//, "")) !== null && _b !== void 0 ? _b : null;
            if (profilePicturePath) {
                formData.profilePicture = profilePicturePath;
            }
            yield userRepository.updateUserDetails(formData);
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
    fetchTopRatedDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctors = yield userRepository.getTopRatedDoctors();
            if (!Doctors) {
                const error = new Error("No top rated doctors found");
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
    checkSlotAvailability(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slotId, timeSlotId } = req.body;
            // check the availability
            const status = yield userRepository.checkAvailabilityStatus(slotId, timeSlotId);
            if (!status) {
                const error = Error('No such a time slot available.');
                error.name = 'ValidationError';
                throw error;
            }
            return status;
        });
    }
    bookAppointment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { userEmail, slotId, timeSlotId, doctorId, paymentMethod, amount } = req.body.bookingDetails;
            const UserId = req.user.Id;
            const Doctor = yield userRepository.findDoctorById(doctorId);
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
            if (paymentMethod === 'Wallet') {
                let Wallet = yield userRepository.findUserWallet(UserId);
                Wallet.balance -= parseInt(amount);
                yield Wallet.save();
            }
            const paymentObject = {
                user: UserId,
                doctor: doctorId,
                amount,
                method: paymentMethod,
                transactionType: 'Booking',
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
            yield userRepository.createAppointment(appointmentObject);
            //Send booking details to user
            yield sendEmail({
                to: userEmail,
                subject: 'Appointment Details',
                html: `<h3>Your Appointment is Confirmed</h3>
            <p><strong>Doctor:</strong> Dr. ${Doctor === null || Doctor === void 0 ? void 0 : Doctor.name}</p>
            <p><strong>Date:</strong> ${availability.date.toLocaleDateString('en-GB')}</p>
            <p><strong>Time:</strong> ${timeSlot.time}</p>
            <p><strong>Payment:</strong> ₹${amount} via ${paymentMethod}</p>
            <p>Thank you for choosing us!</p>
            <p>Best Regards,</p>
            <p>${(_a = Doctor === null || Doctor === void 0 ? void 0 : Doctor.address) === null || _a === void 0 ? void 0 : _a.clinicName}</p>`
            });
        });
    }
    cancelAppointment(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { bookingId } = req.body;
            const UserId = req.user.Id;
            console.log("at service: ", bookingId, UserId);
            const appointment = yield userRepository.findAppointment(bookingId);
            if (!appointment) {
                const error = Error('No appointment with the provided bookingId');
                error.name = 'ValidationError';
                throw error;
            }
            //change the slot status to available
            const updatedStatus = "Available";
            yield userRepository.updateTimeSlot(appointment.timeSlotId, updatedStatus);
            //do the refund and add new payment document
            const paymentAmount = (_a = appointment.payment) === null || _a === void 0 ? void 0 : _a.amount;
            let UserWallet = yield userRepository.findUserWallet(UserId);
            if (!UserWallet) {
                const walletObject = {
                    ownerId: UserId,
                    ownerType: 'User',
                };
                UserWallet = yield userRepository.createUserWallet(walletObject);
            }
            UserWallet.balance += paymentAmount;
            yield UserWallet.save();
            const paymentObject = {
                user: UserId,
                doctor: appointment.doctor,
                amount: paymentAmount,
                method: 'Wallet',
                transactionType: 'Refund',
                status: 'Completed'
            };
            const payment = yield userRepository.createPayment(paymentObject);
            //update appointment document and save
            appointment.status = 'Cancelled';
            appointment.payment = payment._id;
            yield appointment.save();
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
    getWalletTransactions(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const UserId = req.user.Id;
            const transactions = yield userRepository.getUserWalletPayments(UserId);
            return transactions;
        });
    }
    addDoctorReview(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { doctorId, rating, comment } = req.body;
            const UserId = req.user.Id;
            if (!doctorId || !UserId || !rating || !comment) {
                const error = Error('All fields are required.');
                error.name = 'ValidationError';
                throw error;
            }
            const newReview = {
                doctorId,
                patientId: UserId,
                comment,
                rating,
            };
            yield userRepository.createReview(newReview);
            const reviews = yield userRepository.getReviews(doctorId);
            // Calculate the new average rating and review count
            const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
            const newAverage = totalRatings / reviews.length;
            console.log("new avg is: ", newAverage);
            // Step 4: Update the doctor's ratingInfo
            const doctor = yield Doctor.findById(doctorId);
            doctor.ratingInfo.average = newAverage;
            doctor.ratingInfo.count = reviews.length;
            // Step 5: Save the updated doctor document
            yield doctor.save();
        });
    }
    getDoctorReviews(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { docId } = req.query;
            const Reviews = yield userRepository.getReviews(docId);
            if (!Reviews) {
                const error = Error('No reviews for this doctor');
                error.name = 'ValidationError';
                throw error;
            }
            return Reviews;
        });
    }
    getPrescription(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Pr_Id } = req.query;
            const prescription = yield userRepository.findPrescription(Pr_Id);
            if (!prescription) {
                const error = Error('No prescription found with this id');
                error.name = 'ValidationError';
                throw error;
            }
            return prescription;
        });
    }
    fetchSingleDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { docId } = req.query;
            if (!docId) {
                const error = new Error("No doctor id provided");
                error.name = 'ValidationError';
                throw error;
            }
            const Doctor = yield userRepository.findDoctorById(docId);
            if (!Doctor) {
                const error = new Error("No doctor found with this id");
                error.name = 'ValidationError';
                throw error;
            }
            return Doctor;
        });
    }
    googleLogin(googleToken, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield GoogleTokenVerify(googleToken);
                if (!payload) {
                    throw new Error('Failed to verify Google token');
                }
                const { email, name } = payload;
                if (!email || !name) {
                    throw new Error('Email and name is required from Google token');
                }
                let GoogleUser = yield userRepository.findUserByEmail(email);
                if (!GoogleUser) {
                    GoogleUser = yield userRepository.createGoogleUser(email, name);
                }
                return GoogleUser;
            }
            catch (error) {
                console.error('Google login error:', error);
                throw new Error('Error occured during Google login');
            }
        });
    }
}
export default new UserService();
