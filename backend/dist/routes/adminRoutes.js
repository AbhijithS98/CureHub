import express from 'express';
import adminController from '../controllers/adminController.js';
const router = express.Router();
//Authorization
router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/list-doctors', adminController.listDoctors);
router.post('/approve-doctor', adminController.approveDoctor);
router.post('/reject-doctor', adminController.rejectDoctor);
export default router;
