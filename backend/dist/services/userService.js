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
import sendEmail from "../utils/emailSender.js";
class UserService {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield userRepository.findUserByEmail(userData.email);
            if (existingUser) {
                throw new Error("User already exists");
            }
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash(userData.password, salt);
            const otpCode = Math.floor(100000 + Math.random() * 900000);
            const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
            const newUserData = Object.assign(Object.assign({}, userData), { password: hashedPassword, otp: {
                    code: otpCode,
                    expiresAt: otpExpiresAt,
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
    verifyOtp(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp, }) {
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
}
export default new UserService();
