import express from 'express';
import doctorController from '../controllers/doctorController.js';
import { uploadDoctorDocuments } from '../config/multerConfig.js';
import verifyDoctorToken from '../middleware/doctorAuthMiddleware.js';

const router = express.Router();

//Authorization
router.post('/register',uploadDoctorDocuments,doctorController.register);
router.post('/verify-otp',doctorController.verifyOtp);
router.post('/resend-otp',doctorController.resendOtp);
router.post('/login',doctorController.login);
router.post('/logout',doctorController.logout);
router.post('/pass-reset-link',doctorController.sendPassResetLink);
router.post('/reset-password',doctorController.resetPassword);

router.post('/refresh-token',doctorController.refreshToken)
router.get('/get-profile',verifyDoctorToken,doctorController.getProfile);
router.get('/get-availability',doctorController.getAvailabilities);
router.put('/update-profile',verifyDoctorToken,doctorController.updateProfile);
router.put('/add-slots',verifyDoctorToken,doctorController.addNewSlots);
router.delete('/delete-slot',verifyDoctorToken,doctorController.deleteSlot);
router.delete('/delete-timeSlot',verifyDoctorToken,doctorController.deleteTimeSlot);
router.get('/get-appointments',verifyDoctorToken,doctorController.getAppointments);
router.put('/cancel-appointment',verifyDoctorToken,doctorController.cancelAppointment);
router.post('/add-prescription',verifyDoctorToken,doctorController.addPrescription);
router.get('/get-prescription',verifyDoctorToken,doctorController.viewPrescription);
router.put('/update-prescription:id',verifyDoctorToken,doctorController.updatePrescription);
router.get('/get-user',doctorController.getSingleUser);

export default router;

