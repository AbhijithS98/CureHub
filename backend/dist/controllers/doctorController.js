var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import generateDoctorTokens from "../utils/generateDoctorJwt.js";
import verifyRefreshToken from "../utils/refreshToken.js";
class DoctorController {
    constructor(doctorService) {
        this.doctorService = doctorService;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered doctor register');
            try {
                const doctor = yield this.doctorService.registerDoctor(req);
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
    verifyOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, otp } = req.body;
                const isValid = yield this.doctorService.verifyOtp(email, otp);
                if (isValid) {
                    yield this.doctorService.markVerifiedDoctor(email);
                    res.status(200).json({ message: "OTP verified successfully." });
                }
                else {
                    res.status(400).json({ message: "Invalid or expired OTP." });
                }
            }
            catch (error) {
                console.error('verify OTP error:', error);
                next(error);
            }
        });
    }
    resendOtp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.doctorService.updateOtp(email);
                res.status(200).json({ message: 'OTP resend successful' });
            }
            catch (error) {
                console.error('resend OTP error:', error);
                next(error);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const result = yield this.doctorService.authenticateDoctor(email, password, res);
                const token = generateDoctorTokens(res, result._id);
                res.status(200).json({
                    _id: result._id,
                    name: result.name,
                    email: result.email,
                    specialization: result.specialization,
                    medicalLicenseNumber: result.medicalLicenseNumber,
                    experience: result.experience,
                    phone: result.phone,
                    isVerified: result.isVerified,
                    isApproved: result.isApproved,
                    isBlocked: result.isBlocked,
                    token,
                });
            }
            catch (error) {
                console.error('error logging in doctor:', error.message);
                next(error);
            }
        });
    }
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.doctorRefreshJwt;
                if (!refreshToken) {
                    res.status(401).json({ message: 'No doctorRefresh token provided, authorization denied' });
                    return;
                }
                const newAccessToken = verifyRefreshToken(refreshToken, 'doctor', res);
                console.log("doctor token has refreshed");
                if (newAccessToken) {
                    res.status(200).json({ token: newAccessToken });
                }
            }
            catch (error) {
                console.error('refreshToken error:', error.message);
                next(error);
            }
        });
    }
    ;
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorService.clearCookie(req, res);
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                console.error('Logout error:', error);
                next(error);
            }
        });
    }
    sendPassResetLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.doctorService.sendResetLink(email);
                res.status(200).json({ message: 'Reset link send successful' });
            }
            catch (error) {
                console.error('doctor send reset link error:', error.message);
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                yield this.doctorService.resetPass(token, newPassword);
                res.status(200).json({ message: "Password reset successful, please Login!" });
            }
            catch (error) {
                console.error("Doctor Reset password error: ", error.message);
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
                console.log("doctor's email is: ", email);
                const doctor = yield this.doctorService.getDoctor(email);
                res.status(200).json({ doctor });
            }
            catch (error) {
                console.error("Getting doctor profile error: ", error.message);
                next(error);
            }
        });
    }
    getAvailabilities(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.query._id;
                if (!_id) {
                    res.status(400).json({ message: "Doctor id is required" });
                    return;
                }
                const availability = yield this.doctorService.getAvailability(_id);
                res.status(200).json({ availability });
            }
            catch (error) {
                console.error("Getting doctor availability error: ", error.message);
                next(error);
            }
        });
    }
    updateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered doctor updation');
            try {
                yield this.doctorService.updateDoctor(req);
                res.status(200).json({ message: 'Doctor details updated successfully.' });
            }
            catch (error) {
                console.error("Updating doctor error: ", error.message);
                next(error);
            }
        });
    }
    addNewSlots(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entered slot updation');
            try {
                yield this.doctorService.updateSlots(req);
                res.status(200).json({ message: 'Slots added successfully.' });
            }
            catch (error) {
                console.error("Updating slot error: ", error.message);
                next(error);
            }
        });
    }
    deleteSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorService.removeSlot(req);
                res.status(200).json({ message: 'Slot deleted successfully.' });
            }
            catch (error) {
                console.error("deleting slot error: ", error.message);
                next(error);
            }
        });
    }
    deleteTimeSlot(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorService.removeTimeSlot(req);
                res.status(200).json({ message: 'Time Slot deleted successfully.' });
            }
            catch (error) {
                console.error("deleting time slot error: ", error.message);
                next(error);
            }
        });
    }
    getAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const doc_id = (_a = req.doctor) === null || _a === void 0 ? void 0 : _a.Id;
                const appointments = yield this.doctorService.fetchAppointments(doc_id);
                res.status(200).json({ appointments });
            }
            catch (error) {
                console.error("Getting doctor appointments error: ", error.message);
                next(error);
            }
        });
    }
    cancelAppointment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("at doc controller");
                yield this.doctorService.cancelBooking(req);
                res.status(200).json({ message: "booking cancelled successfully." });
            }
            catch (error) {
                console.error("doctor cancel booking error: ", error.message);
                next(error);
            }
        });
    }
    addPrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.doctorService.addPatientPrescription(req);
                res.status(200).json({ message: "prescription added successfully." });
            }
            catch (error) {
                console.error("adding prescription error: ", error.message);
                next(error);
            }
        });
    }
    getSingleUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.doctorService.fetchUser(req);
                res.status(200).json({ data });
            }
            catch (error) {
                console.error("Getting single user error: ", error.message);
                next(error);
            }
        });
    }
}
export default DoctorController;
