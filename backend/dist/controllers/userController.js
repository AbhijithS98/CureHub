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
import generateUserTokens from "../utils/generateUserJwt.js";
import verifyRefreshToken from "../utils/refreshToken.js";
class UserController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, phone, password } = req.body;
                const user = yield userService.registerUser(req);
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
                const token = generateUserTokens(res, result._id);
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
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.userRefreshJwt;
            if (!refreshToken) {
                res.status(401).json({ message: 'No refresh token provided, authorization denied' });
                return;
            }
            const newAccessToken = verifyRefreshToken(refreshToken, 'user', res);
            console.log("token has refreshed");
            if (newAccessToken) {
                res.status(200).json({ token: newAccessToken });
            }
        });
    }
    ;
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
    getTopRatedDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.fetchTopRatedDoctors();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching top rated doctors list error:', error);
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
    getSingleDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                const result = yield userService.getSingleDoc(email);
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching single doctor error:', error);
                next(error);
            }
        });
    }
    getProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.query.email;
                if (!email) {
                    res.status(400).json({ message: "Email is required" });
                    return;
                }
                const user = yield userService.getUser(email);
                res.status(200).json({ user });
            }
            catch (error) {
                console.error("Getting user profile error: ", error.message);
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered user updation');
            try {
                yield userService.updateUser(req);
                res.status(200).json({ message: 'user details updated successfully.' });
            }
            catch (error) {
                console.error("Updating user error: ", error.message);
                next(error);
            }
        });
    }
    bookSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userService.bookAppointment(req);
                res.status(200).json({ message: "user's slot booked successfully." });
            }
            catch (error) {
                console.error("user slot booking error: ", error.message);
                next(error);
            }
        });
    }
    getUserAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.Id;
                const result = yield userService.getAppointments(userId);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error('fetching user appointments error: ', error);
                next(error);
            }
        });
    }
    walletRecharge(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userService.rechargeWallet(req);
                res.status(200).json({ message: 'Wallet recharged successfully' });
            }
            catch (error) {
                console.error('user wallet recharge error:', error);
                next(error);
            }
        });
    }
    getUserWallet(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield userService.getWallet(req);
                res.status(200).json({ wallet });
            }
            catch (error) {
                console.error('fetching user wallet error:', error);
                next(error);
            }
        });
    }
    getUserWalletTransactions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.getWalletTransactions(req);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error('fetching user wallet transactions error:', error);
                next(error);
            }
        });
    }
    cancelBooking(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("at controller");
                yield userService.cancelAppointment(req);
                res.status(200).json({ message: "booking cancelled successfully." });
            }
            catch (error) {
                console.error("user cancel booking error: ", error.message);
                next(error);
            }
        });
    }
    addReview(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userService.addDoctorReview(req);
                res.status(200).json({ message: "review added successfully." });
            }
            catch (error) {
                console.error("user adding review error: ", error.message);
                next(error);
            }
        });
    }
    getReviews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.getDoctorReviews(req);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error('fetching doctor reviews: ', error);
                next(error);
            }
        });
    }
    viewPrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userService.getPrescription(req);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error("Getting user single prescription error: ", error.message);
                next(error);
            }
        });
    }
    getDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield userService.fetchSingleDoctor(req);
                res.status(200).json({ data });
            }
            catch (error) {
                console.error('fetching single doctor error:', error);
                next(error);
            }
        });
    }
}
export default new UserController();
