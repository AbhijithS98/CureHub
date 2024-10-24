var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import adminService from "../services/adminService.js";
import generateAdminToken from "../utils/generateAdminJwt.js";
class AdminController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield adminService.authenticateAdmin(email, password, res);
                const token = generateAdminToken(res, admin._id);
                res.status(200).json({
                    message: "Admin Login success!",
                    adminId: admin._id,
                    token,
                });
            }
            catch (error) {
                console.error("Admin login error: ", error.message);
                next(error);
            }
        });
    }
    logout(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield adminService.clearCookie(req, res);
                res.status(200).json({ message: 'Logout successful' });
            }
            catch (error) {
                console.error('admin Logout error:', error);
                next(error);
            }
        });
    }
    sendPassResetLink(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield adminService.sendResetLink(email);
                res.status(200).json({ message: 'Reset link send successful' });
            }
            catch (error) {
                console.error('admin send reset link error:', error.message);
                next(error);
            }
        });
    }
    resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                yield adminService.resetPass(token, newPassword);
                res.status(200).json({ message: "Password reset successful, please Login!" });
            }
            catch (error) {
                console.error("admin Reset password error: ", error.message);
                next(error);
            }
        });
    }
    listDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield adminService.getDoctors();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching doctors list error:', error);
                next(error);
            }
        });
    }
    approveDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Ac");
            try {
                const { email } = req.body;
                yield adminService.approveDoctor(email);
                res.status(200).json({ message: 'Doctor Approved Succesfully' });
            }
            catch (error) {
                console.error('Approving doctor error:', error);
                next(error);
            }
        });
    }
    rejectDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield adminService.rejectDoctor(email);
                res.status(200).json({ message: 'Doctor Rejected Succesfully' });
            }
            catch (error) {
                console.error('Rejecting doctor error:', error);
                next(error);
            }
        });
    }
}
export default new AdminController();
