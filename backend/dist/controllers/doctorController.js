var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import doctorService from "../services/doctorService.js";
class DoctorController {
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered doctor register');
            try {
                const doctor = yield doctorService.registerDoctor(req);
                res.status(201).json({ message: 'Doctor registered successfully. Please verify your email',
                    doctorId: doctor._id,
                });
            }
            catch (error) {
                console.error("Registering doctor error: ", error.message);
                next(error);
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const isValid = yield doctorService.verifyOtp(email, otp);
                if (isValid) {
                    yield doctorService.markVerifiedDoctor(email);
                    res.status(200).json({ message: "OTP verified successfully." });
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
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield doctorService.updateOtp(email);
                res.status(200).json({ message: 'OTP resend successful' });
            }
            catch (error) {
                console.error('resend OTP error:', error);
                next(error);
            }
        });
    }
}
export default new DoctorController();
