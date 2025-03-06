var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AdminService } from "../services/adminService.js";
import generateAdminTokens from "../utils/generateAdminJwt.js";
import verifyRefreshToken from "../utils/refreshToken.js";
const adminService = new AdminService();
class AdminController {
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield adminService.authenticateAdmin(email, password, res);
                const token = generateAdminTokens(res, admin._id);
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
    listUnapprovedDoctors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield adminService.getUnapprovedDoctors();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching unapproved doctors list error:', error);
                next(error);
            }
        });
    }
    approveDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
    listUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield adminService.getUsers();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching Users list error:', error);
                next(error);
            }
        });
    }
    blockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hit blockkkkkkk");
            try {
                const { email } = req.body;
                console.log("user email: ", email);
                yield adminService.blockUser(email);
                res.status(200).json({ message: 'User blocked Succesfully' });
            }
            catch (error) {
                console.error('Blocking user error:', error);
                next(error);
            }
        });
    }
    unblockUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield adminService.unblockUser(email);
                res.status(200).json({ message: 'User unblocked Succesfully' });
            }
            catch (error) {
                console.error('unBlocking user error:', error);
                next(error);
            }
        });
    }
    blockDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                console.log("Doctor email: ", email);
                yield adminService.blockDoctor(email);
                res.status(200).json({ message: 'Doctor blocked Succesfully' });
            }
            catch (error) {
                console.error('Blocking Doctor error:', error);
                next(error);
            }
        });
    }
    unblockDoctor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield adminService.unblockDoctor(email);
                res.status(200).json({ message: 'Doctor unblocked Succesfully' });
            }
            catch (error) {
                console.error('unBlocking Doctor error:', error);
                next(error);
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.adminRefreshJwt;
            if (!refreshToken) {
                res.status(401).json({ message: 'No adminRefresh token provided, authorization denied' });
                return;
            }
            const newAccessToken = verifyRefreshToken(refreshToken, 'admin', res);
            console.log("admin token has refreshed");
            if (newAccessToken) {
                res.status(200).json({ token: newAccessToken });
            }
        });
    }
    ;
    listAppointments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield adminService.getAppointments();
                res.status(200).json(result);
            }
            catch (error) {
                console.error('fetching doctor appointments from admin error:', error);
                next(error);
            }
        });
    }
    fetchUserStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersCount = yield adminService.getUsersCount();
                res.status(200).json({ usersCount });
            }
            catch (error) {
                console.error('admin fetching user stats error:', error);
                next(error);
            }
        });
    }
    fetchDoctorStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const DoctorsCount = yield adminService.getDoctorsCount();
                res.status(200).json({ DoctorsCount });
            }
            catch (error) {
                console.error('admin fetching doctor stats error:', error);
                next(error);
            }
        });
    }
    fetchAppointmentStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const AppointmentStats = yield adminService.getAllAppointmentStats();
                res.status(200).json({ AppointmentStats });
            }
            catch (error) {
                console.error('admin fetching appointment stats error:', error);
                next(error);
            }
        });
    }
    fetchAppointmentsChartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Result = yield adminService.getAppointmentTrends();
                res.status(200).json({ Result });
            }
            catch (error) {
                console.error('admin fetching appointment chart data error:', error);
                next(error);
            }
        });
    }
    fetchAppointmentReportData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Result = yield adminService.getAppointmentReportData(req);
                res.status(200).json({ Result });
            }
            catch (error) {
                console.error('admin fetching appointment report data error:', error);
                next(error);
            }
        });
    }
}
export default new AdminController();
