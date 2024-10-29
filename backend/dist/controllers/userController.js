var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userService from "../services/userService.js";
import generateUserToken from "../utils/generateUserJwt.js";
class UserController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                const user = yield userService.registerUser({ name, email, phone, password });
                res.status(201).json({
                    message: "User registered successfully. Please verify your email.",
                    userId: user._id,
                });
            }
            catch (error) {
                console.error("Registering user error: ", error.message);
                next(error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const isValid = yield userService.verifyOtp(email, otp);
                if (isValid) {
                    yield userService.activateUser(email);
                    res.status(200).json({ message: "OTP verified successfully, user activated." });
                }
                else {
                    res.status(400).json({ message: "Invalid or expired OTP." });
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield userService.authenticateUser(email, password, res);
                const token = generateUserToken(res, result._id);
                res.status(200).json({
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    isVerified: result.isVerified,
                    isBlocked: result.isBlocked,
                    token,
                });
            }
            catch (error) {
                console.error('error logging in user:', error.message);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userService.clearCookie(req, res);
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                console.error('Logout error:', error);
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield userService.updateOtp(email);
                res.status(200).json({ message: 'OTP resend successful' });
            }
            catch (error) {
                console.error('resend OTP error:', error);
                next(error);
            }
        });
    }
    sendPassResetLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield userService.sendResetLink(email);
                res.status(200).json({ message: 'Reset link send successful' });
            }
            catch (error) {
                console.error('send reset link error:', error.message);
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                yield userService.resetPass(token, newPassword);
                res.status(200).json({ message: "Password reset successful, please Login!" });
            }
            catch (error) {
                console.error("Reset password error: ", error.message);
                next(error);
            }
        });
    }
    getDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.fetchDoctors();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching doctors list error:', error);
                next(error);
            }
        });
    }
    getDocSpecializations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.fetchDocSpecs();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching doctor specializations list error:', error);
                next(error);
            }
        });
    }
}
export default new UserController();
