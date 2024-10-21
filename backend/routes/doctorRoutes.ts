import express from 'express';
import doctorController from '../controllers/doctorController.js';
import { multerUploadDoctorProfile } from '../config/multerConfig.js';

const router = express.Router();

//Authorization
router.post('/register',multerUploadDoctorProfile.single('idProof'),doctorController.register);
router.post('/verify-otp',doctorController.verifyOtp);
router.post('/resend-otp',doctorController.resendOtp);
router.post('/login',doctorController.login);
router.post('/logout',doctorController.logout);
router.post('/pass-reset-link',doctorController.sendPassResetLink);
router.post('/reset-password',doctorController.resetPassword);


export default router;