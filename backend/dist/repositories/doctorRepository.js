var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Doctor from "../models/doctor.js";
class DoctorRepository {
    findDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ email });
        });
    }
    findDoctorByEmailAndOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ email, 'otp.code': otp });
        });
    }
    findDoctorByPwResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ pwResetToken: token, pwTokenExpiresAt: { $gt: new Date() } });
        });
    }
    createDoctor(doctorData) {
        return __awaiter(this, void 0, void 0, function* () {
            const doctor = new Doctor(doctorData);
            return yield doctor.save();
        });
    }
    markVerifiedDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { isVerified: true, 'otp.code': null, 'otp.expiresAt': null });
        });
    }
    updateOtp(email, newOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { otp: newOtp });
        });
    }
    updateResettoken(email, token, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { pwResetToken: token, pwTokenExpiresAt: expiry });
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ pwResetToken: token }, { password: newPassword,
                pwResetToken: null,
                pwTokenExpiresAt: null,
            });
        });
    }
    updateDoctorDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phone, specialization, medicalLicenseNumber, gender, dob, experience, consultationFee, clinicName, district, city, bio, } = req.body;
            yield Doctor.updateOne({ email }, { name,
                email,
                phone,
                specialization,
                medicalLicenseNumber,
                gender,
                dob,
                experience,
                consultationFee,
                'address.clinicName': clinicName,
                'address.district': district,
                'address.city': city,
                bio
            });
        });
    }
    addSlots(email, newSlots) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { $push: { availability: { $each: newSlots } } }, { new: true });
        });
    }
    deleteSlot(email, slotId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { $pull: { availability: { _id: slotId } } }, { new: true });
        });
    }
    deleteTimeSlot(email, slotId, timeSlotId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email, "availability._id": slotId }, { $pull: { "availability.$.timeSlots": { _id: timeSlotId } } }, { new: true });
        });
    }
}
export default new DoctorRepository();
