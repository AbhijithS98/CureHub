var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Admin from "../models/admin.js";
import Appointment from "../models/appointment.js";
import Doctor from "../models/doctor.js";
import User from "../models/user.js";
class AdminRepository {
    findAdminByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin.findOne({ email });
        });
    }
    getAllDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.find({ isApproved: true });
        });
    }
    getAllUnapprovedDoctors() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.find({ isApproved: false });
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.find({});
        });
    }
    findDoctorByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Doctor.findOne({ email });
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ email });
        });
    }
    findAdminByPwResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Admin.findOne({ pwResetToken: token, pwTokenExpiresAt: { $gt: new Date() } });
        });
    }
    updateResettoken(email, token, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Admin.updateOne({ email }, { pwResetToken: token, pwTokenExpiresAt: expiry });
        });
    }
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Admin.updateOne({ pwResetToken: token }, { password: newPassword,
                pwResetToken: null,
                pwTokenExpiresAt: null,
            });
        });
    }
    approveDoc(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { isApproved: true });
        });
    }
    deleteDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.deleteOne({ email });
        });
    }
    blockUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ email }, { isBlocked: true });
        });
    }
    unblockUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User.updateOne({ email }, { isBlocked: false });
        });
    }
    blockDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { isBlocked: true });
        });
    }
    unblockDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Doctor.updateOne({ email }, { isBlocked: false });
        });
    }
    getAllAppointments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Appointment.find().populate('doctor', 'name').populate('user', 'name').exec();
        });
    }
}
export default new AdminRepository();
