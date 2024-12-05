import express from 'express';
import adminController from '../controllers/adminController.js';
import verifyAdminToken from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

//Authorization
router.post('/login',adminController.login)
router.post('/logout',adminController.logout)
router.post('/pass-reset-link',adminController.sendPassResetLink)
router.post('/reset-password',adminController.resetPassword)

router.post('/refresh-token',adminController.refreshToken)
router.get('/list-doctors',verifyAdminToken,adminController.listDoctors)
router.get('/list-unapproved-doctors',verifyAdminToken,adminController.listUnapprovedDoctors)
router.post('/approve-doctor',verifyAdminToken,adminController.approveDoctor)
router.post('/reject-doctor',verifyAdminToken,adminController.rejectDoctor)
router.get('/list-users',verifyAdminToken,adminController.listUsers)
router.post('/block-user',verifyAdminToken,adminController.blockUser)
router.post('/unblock-user',verifyAdminToken,adminController.unblockUser)
router.post('/block-doctor',verifyAdminToken,adminController.blockDoctor)
router.post('/unblock-doctor',verifyAdminToken,adminController.unblockDoctor)
router.get('/list-appointments',verifyAdminToken,adminController.listAppointments)
router.get('/stats-users',verifyAdminToken,adminController.fetchUserStats)
router.get('/stats-doctors',verifyAdminToken,adminController.fetchDoctorStats)
router.get('/stats-appointments',verifyAdminToken,adminController.fetchAppointmentStats)
router.get('/stats-revenue',verifyAdminToken,adminController.fetchRevenueStats)
router.get('/stats-refund',verifyAdminToken,adminController.fetchRefundStats)
router.get('/appointments-chart-data',verifyAdminToken,adminController.fetchAppointmentsChartData)
router.get('/revenue-chart-data',verifyAdminToken,adminController.fetchRevenueChartData)
router.get('/appointment-report-data',verifyAdminToken,adminController.fetchAppointmentReportData)
router.get('/revenue-report-data',verifyAdminToken,adminController.fetchRevenueReportData)


export default router;
