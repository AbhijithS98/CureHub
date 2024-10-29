import express from 'express';
import adminController from '../controllers/adminController.js';
const router = express.Router();
//Authorization
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/list-doctors', adminController.listDoctors);
router.get('/list-unapproved-doctors', adminController.listUnapprovedDoctors);
router.post('/approve-doctor', adminController.approveDoctor);
router.post('/reject-doctor', adminController.rejectDoctor);
router.post('/pass-reset-link', adminController.sendPassResetLink);
router.post('/reset-password', adminController.resetPassword);
router.get('/list-users', adminController.listUsers);
router.post('/block-user', adminController.blockUser);
router.post('/unblock-user', adminController.unblockUser);
router.post('/block-doctor', adminController.blockDoctor);
router.post('/unblock-doctor', adminController.unblockDoctor);
export default router;