var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sendEmail from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
class DoctorService {
    constructor(doctorRepository, paymentRepository, prescriptionRepository) {
        this.doctorRepository = doctorRepository;
        this.paymentRepository = paymentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }
    registerDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const formData = req.body;
            const { email, password } = formData;
            const existingDoctor = yield this.doctorRepository.findDoctorByEmail(email);
            if (existingDoctor) {
                const error = Error("Doctor already exists");
                error.name = 'ValidationError';
                throw error;
            }
            console.log('File Paths:', req.files);
            const idProofPath = req.files
                ? req.files['idProof'][0].path
                    .replace(/\\/g, '/') // Normalize separators to forward slashes
                    .replace(/^public[\/\\]?/, '') // Remove `public/` or `public\` prefix
                : null;
            const medicalDegreePath = req.files
                ? req.files['medicalDegree'][0].path
                    .replace(/\\/g, '/')
                    .replace(/^public[\/\\]?/, '')
                : null;
            const profilePicturePath = req.files
                ? req.files['profilePicture'][0].path
                    .replace(/\\/g, '/')
                    .replace(/^public[\/\\]?/, '')
                : null;
            if (!idProofPath || !medicalDegreePath || !profilePicturePath) {
                const error = Error('All files (ID proof, Medical Degree, profilePicture) are required');
                error.name = 'ValidationError';
                throw error;
            }
            console.log('Normalized idProof Path:', idProofPath);
            console.log('Normalized medicalDegree Path:', medicalDegreePath);
            console.log('Normalized profilePicture Path:', profilePicturePath);
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
            const doctor = yield this.doctorRepository.createDoctor(newDoctorData);
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
            const doctor = yield this.doctorRepository.findDoctorByEmailAndOtp(email, Number(otp));
            if (!doctor || !doctor.otp || doctor.otp.expiresAt < new Date()) {
                return false;
            }
            return true;
        });
    }
    markVerifiedDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.doctorRepository.markVerifiedDoctor(email);
        });
    }
    updateOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otpCode = Math.floor(100000 + Math.random() * 900000);
                const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);
                yield this.doctorRepository.updateOtp(email, { code: otpCode, expiresAt: otpExpiresAt });
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
            const doctor = yield this.doctorRepository.findDoctorByEmail(email);
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
            const doctor = yield this.doctorRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = Error('doctor not found');
                error.name = 'ValidationError';
                throw error;
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
            yield this.doctorRepository.updateResettoken(doctor.email, resetToken, tokenExpiry);
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
            const doctor = yield this.doctorRepository.findDoctorByPwResetToken(token);
            if (!doctor) {
                const error = Error('Invalid or expired token');
                error.name = 'ValidationError';
                throw error;
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(password, salt);
            yield this.doctorRepository.updatePassword(token, hashedPassword);
        });
    }
    getDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const Doctor = yield this.doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            return Doctor;
        });
    }
    getAvailability(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const availabilities = yield this.doctorRepository.getAvailabilities(_id);
            if (!availabilities) {
                const error = Error('No availabilities for this doctor.');
                error.name = 'ValidationError';
                throw error;
            }
            return availabilities;
        });
    }
    updateDoctor(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const Doctor = yield this.doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield this.doctorRepository.updateDoctorDetails(req);
        });
    }
    updateSlots(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.query;
            const { newSlots } = req.body;
            console.log("slots are: ", newSlots);
            const Doctor = yield this.doctorRepository.findDoctorByEmail(email);
            if (!Doctor) {
                const error = Error('No doctor with this email.');
                error.name = 'ValidationError';
                throw error;
            }
            yield this.doctorRepository.addSlots(email, newSlots);
        });
    }
    removeSlot(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slotId } = req.body;
            if (!slotId) {
                const error = Error('slot id must be provided');
                error.name = 'ValidationError';
                throw error;
            }
            yield this.doctorRepository.deleteSlot(slotId);
        });
    }
    removeTimeSlot(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { slotId, timeSlotId } = req.body;
            if (!slotId || !timeSlotId) {
                const error = Error('SlotId and TimeSlotId must be provided');
                error.name = 'ValidationError';
                throw error;
            }
            yield this.doctorRepository.deleteTimeSlot(slotId, timeSlotId);
        });
    }
    fetchAppointments(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointments = yield this.doctorRepository.getAppointments(_id);
            if (!appointments) {
                const error = Error('No appointments for this doctor.');
                error.name = 'ValidationError';
                throw error;
            }
            return appointments;
        });
    }
    cancelBooking(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { appointmentId, reason } = req.body;
            console.log("apnt id :", appointmentId, "rs: ", reason);
            const appointment = yield this.doctorRepository.findAppointment(appointmentId);
            if (!appointment) {
                const error = Error('No appointment with the provided bookingId');
                error.name = 'ValidationError';
                throw error;
            }
            //delete the time slot from availability
            const slotId = appointment.slotId.toString();
            const timeSlotId = appointment.timeSlotId.toString();
            yield this.doctorRepository.deleteTimeSlot(slotId, timeSlotId);
            //do the refund and add new payment document
            const paymentAmount = (_a = appointment.payment) === null || _a === void 0 ? void 0 : _a.amount;
            const userId = appointment.user.toString();
            const docId = appointment.doctor.toString();
            const Wallet = yield this.doctorRepository.findUserWallet(userId);
            Wallet.balance += paymentAmount;
            yield Wallet.save();
            const paymentObject = {
                user: appointment.user,
                doctor: appointment.doctor,
                amount: paymentAmount,
                method: 'Wallet',
                transactionType: 'Refund',
                status: 'Completed'
            };
            const payment = yield this.paymentRepository.createPayment(paymentObject);
            //update appointment document and save
            appointment.status = 'Cancelled';
            appointment.payment = payment._id;
            appointment.cancellationReason = reason;
            yield appointment.save();
            //Send notification mail
            const user = yield this.doctorRepository.findUserById(userId);
            const Doctor = yield this.doctorRepository.findDoctorById(docId);
            yield sendEmail({
                to: user.email,
                subject: 'Appointment Cancellation Notification',
                html: `<h3>Your Appointment Has Been Cancelled</h3>
        <p>Dear ${user.name},</p>
        <p>We regret to inform you that your appointment has been cancelled. Below are the details:</p>
        <p><strong>Doctor:</strong> Dr. ${Doctor.name}</p>
        <p><strong>Date:</strong> ${appointment.date.toLocaleDateString('en-GB')}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Cancellation Reason:</strong> ${reason}</p>
        <p><strong>Refund:</strong> ₹${paymentAmount} has been refunded to your wallet.</p>
        <p>You can use the wallet balance for future bookings or other services.</p>
        <p>We apologize for any inconvenience caused and appreciate your understanding.</p>
        <p>Best Regards,</p>
        <p>${Doctor.address.clinicName}</p>`
            });
        });
    }
    addPatientPrescription(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const doc_id = (_a = req.doctor) === null || _a === void 0 ? void 0 : _a.Id;
            const { prescriptionData } = req.body;
            console.log("prescription is: ", prescriptionData);
            prescriptionData.doctor = doc_id;
            const response = yield this.prescriptionRepository.createPrescription(prescriptionData);
            if (response) {
                console.log("prescription created: ", response);
            }
            const Appointment = yield this.doctorRepository.findAppointment(prescriptionData.appointment);
            if (Appointment) {
                Appointment.prescription = response._id;
                Appointment.status = 'Completed';
                yield Appointment.save();
            }
        });
    }
    fetchUser(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.query.userId;
            if (!userId) {
                const error = Error('No user id provided');
                error.name = 'ValidationError';
                throw error;
            }
            const User = yield this.doctorRepository.findUserById(userId);
            if (!User) {
                const error = Error('No User found with this id');
                error.name = 'ValidationError';
                throw error;
            }
            return User;
        });
    }
}
export default DoctorService;
