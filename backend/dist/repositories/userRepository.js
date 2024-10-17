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
class UserRepository {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield User.findOne({ email });
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
}
export default new UserRepository();
