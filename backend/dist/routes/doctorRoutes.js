import express from 'express';
import doctorController from '../controllers/doctorController.js';
import { uploadDoctorDocuments } from '../config/multerConfig.js';
const router = express.Router();
//Authorization
router.post('/register', uploadDoctorDocuments, doctorController.register);
router.post('/verify-otp', doctorController.verifyOtp);
router.post('/resend-otp', doctorController.resendOtp);
router.post('/login', doctorController.login);
router.post('/logout', doctorController.logout);
router.post('/pass-reset-link', doctorController.sendPassResetLink);
router.post('/reset-password', doctorController.resetPassword);
router.get('/get-profile', doctorController.getProfile);
router.put('/update-profile', doctorController.updateProfile);
router.put('/add-slots', doctorController.addNewSlots);
router.delete('/delete-slot', doctorController.deleteSlot);
export default router;
