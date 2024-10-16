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
class UserController {
    register(req, res) {
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
                res.status(400).json({ message: error.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const isValid = yield userService.verifyOtp({ email, otp });
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
}
export default new UserController();
