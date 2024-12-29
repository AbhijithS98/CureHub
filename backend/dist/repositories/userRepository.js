var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.js";
import Doctor from "../models/doctor.js";
import Payment from "../models/paymentSchema.js";
import Availability from "../models/availability.js";
import Appointment from "../models/appointment.js";
import Wallet from "../models/walletSchema.js";
import Review from "../models/reviewSchema.js";
import Prescription from "../models/prescriptionSchema.js";
class UserRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ email });
        });
    }
    findDoctorById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ _id });
        });
    }
    findUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ _id });
        });
    }
    findUserByPwResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ pwResetToken: token, pwTokenExpiresAt: { $gt: new Date() } });
        });
    }
    findUserByEmailAndOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ email, 'otp.code': otp });
        });
    }
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User(userData);
            return yield user.save();
        });
    }
    activateUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ email }, { isVerified: true, 'otp.code': null, 'otp.expiresAt': null });
        });
    }
    updateOtp(email, newOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ email }, { otp: newOtp });
        });
    }
    updateResettoken(email, token, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ email }, { pwResetToken: token, pwTokenExpiresAt: expiry });
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ pwResetToken: token }, { password: newPassword,
                pwResetToken: null,
                pwTokenExpiresAt: null,
            });
        });
    }
    getAllDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.find({ isApproved: true });
        });
    }
    getTopRatedDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.find({ isApproved: true })
                .sort({ "ratingInfo.average": -1 })
                .limit(3);
        });
    }
    getAllSpecializations() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.distinct("specialization");
        });
    }
    fetchSingleDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ email });
        });
    }
    updateUserDetails(updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = updatedData;
            yield User.updateOne({ email }, { $set: updatedData });
        });
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = new Payment(paymentData);
            yield payment.save();
            return payment;
        });
    }
    createAppointment(appointmentDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const appointment = new Appointment(appointmentDetails);
            yield appointment.save();
            return appointment;
        });
    }
    createUserWallet(walletObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = new Wallet(walletObject);
            return yield wallet.save();
        });
    }
    findAvailability(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Availability.findOne({ _id: slotId });
        });
    }
    checkAvailabilityStatus(slotId, timeSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            const availability = yield Availability.findOne({ _id: slotId });
            if (!availability) {
                return null;
            }
            const timeSlot = availability.timeSlots.find((slot) => slot._id.toString() === timeSlotId.toString());
            if (!timeSlot) {
                return null;
            }
            return timeSlot.status;
        });
    }
    findUserWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Wallet.findOne({ ownerId: userId });
        });
    }
    getUserAppointments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.find({ user: id })
                .populate('doctor', 'name profilePicture')
                .populate('user', 'name profilePicture')
                .sort({ createdAt: -1 });
        });
    }
    findAppointment(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.findOne({ _id: bookingId }).populate('payment');
        });
    }
    updateTimeSlot(timeslotId, updatedStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Availability.updateOne({ "timeSlots._id": timeslotId }, { $set: { "timeSlots.$.status": updatedStatus } });
        });
    }
    getUserWalletPayments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Payment.find({
                user: id,
                $or: [
                    { transactionType: "Recharge" },
                    { method: "Wallet" }
                ]
            }).sort({ createdAt: -1 });
        });
    }
    createReview(newReview) {
        return __awaiter(this, void 0, void 0, function* () {
            const review = new Review(newReview);
            yield review.save();
        });
    }
    getReviews(doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Review.find({ doctorId }).populate('patientId', 'name profilePicture');
        });
    }
    findPrescription(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Prescription.findOne({ _id: prescriptionId })
                .populate('appointment', 'date time')
                .populate('doctor', 'name specialization address')
                .populate('patient', 'name phone');
        });
    }
    createGoogleUser(email, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new User({
                email,
                name,
                phone: 'N/A',
                isVerified: true,
                password: 'google_oauth',
            });
            return newUser.save();
        });
    }
}
export default new UserRepository();
