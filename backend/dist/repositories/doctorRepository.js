var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Doctor from "../models/doctorModel.js";
import User from "../models/userModel.js";
import Availability from "../models/availabilityModel.js";
import Appointment from "../models/appointmentModel.js";
import Wallet from "../models/walletModel.js";
import { BaseRepository } from "./baseRepository.js";
class DoctorRepository extends BaseRepository {
    constructor() {
        super(Doctor);
    }
    findDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email });
        });
    }
    findDoctorById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ _id });
        });
    }
    findUserById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ _id });
        });
    }
    getAvailabilities(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Availability.find({ doctor: _id });
        });
    }
    getAppointments(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.find({ doctor: _id }).populate("user", "name");
        });
    }
    findDoctorByEmailAndOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ email, "otp.code": otp });
        });
    }
    findDoctorByPwResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findOne({ pwResetToken: token, pwTokenExpiresAt: { $gt: new Date() } });
        });
    }
    createDoctor(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.create(doctorData);
        });
    }
    markVerifiedDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update({ email }, { isVerified: true, otp: { code: null, expiresAt: null } });
        });
    }
    updateOtp(email, newOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update({ email }, { otp: newOtp });
        });
    }
    updateResettoken(email, token, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update({ email }, { pwResetToken: token, pwTokenExpiresAt: expiry });
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.update({ pwResetToken: token }, { password: newPassword, pwResetToken: null, pwTokenExpiresAt: null });
        });
    }
    updateDoctorDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, specialization, medicalLicenseNumber, gender, dob, experience, consultationFee, clinicName, district, city, bio } = req.body;
            return yield this.update({ email }, {
                name,
                email,
                phone,
                specialization,
                medicalLicenseNumber,
                gender,
                dob,
                experience,
                consultationFee,
                address: {
                    clinicName,
                    district,
                    city,
                },
                bio,
            });
        });
    }
    addSlots(email, newSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Availability.insertMany(newSlots);
        });
    }
    deleteSlot(slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Availability.deleteOne({ _id: slotId });
        });
    }
    deleteTimeSlot(slotId, timeSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Availability.updateOne({ _id: slotId }, { $pull: { timeSlots: { _id: timeSlotId } } }, { new: true });
        });
    }
    findAppointment(appointmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.findOne({ _id: appointmentId }).populate("payment");
        });
    }
    findUserWallet(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Wallet.findOne({ ownerId: userId });
        });
    }
}
export default new DoctorRepository();
