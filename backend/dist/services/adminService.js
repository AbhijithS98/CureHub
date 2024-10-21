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
import bcrypt from 'bcryptjs';
import generateAdminToken from "../utils/generateAdminJwt.js";
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
            generateAdminToken(res, admin._id);
            return admin;
        });
    }
    clearCookie(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminJwt', '', {
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
    approveDoctor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("As");
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
            console.log("As");
            const doctor = yield adminRepository.findDoctorByEmail(email);
            if (!doctor) {
                const error = new Error("No doctor found with the email");
                error.name = 'ValidationError';
                throw error;
            }
            yield adminRepository.deleteDoctor(email);
        });
    }
}
export default new AdminService();
