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
}
export default new DoctorRepository();
