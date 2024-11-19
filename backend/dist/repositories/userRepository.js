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
import Appointment from "../models/appointments.js";
class UserRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ email });
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
    updateUserDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, dob, address } = req.body;
            yield User.updateOne({ email }, { name,
                email,
                phone,
                dob,
                address
            });
        });
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = new Payment(paymentData);
            yield payment.save();
            return payment;
        });
    }
    findAppointment(slotId, doctorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.findOne({ _id: slotId, doctor: doctorId });
        });
    }
    getUserAppointments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pipeline = [
                {
                    $match: {
                        "timeSlots.user": userId, // Match appointments with time slots booked by the user
                    },
                },
                {
                    $unwind: "$timeSlots", // Unwind time slots array
                },
                {
                    $match: {
                        "timeSlots.user": userId, // Filter relevant time slots after unwinding
                    },
                },
                {
                    $lookup: {
                        from: "doctors", // Name of the doctors collection
                        localField: "doctor",
                        foreignField: "_id",
                        as: "doctorDetails", // Resulting doctor details
                    },
                },
                {
                    $unwind: "$doctorDetails", // Unwind doctor details array
                },
                {
                    $project: {
                        _id: 0, // Exclude appointment ID
                        date: 1,
                        time: "$timeSlots.time", // Include time slot time
                        timeSlotId: "$timeSlots._id", // Include time slot ID
                        status: "$timeSlots.status", // Include time slot status
                        doctorName: { $concat: ["Dr. ", "$doctorDetails.name"] }, // Include doctor name
                    },
                },
            ];
            const results = yield Appointment.aggregate(pipeline);
            console.log(results);
            return results;
        });
    }
}
export default new UserRepository();
