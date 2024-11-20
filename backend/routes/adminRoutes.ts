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

export default router;
