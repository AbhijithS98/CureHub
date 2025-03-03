import express from 'express';
import DoctorController from '../controllers/doctorController.js';
import { uploadDoctorDocuments } from '../config/multerConfig.js';
import verifyDoctorToken from '../middleware/doctorAuthMiddleware.js';
import paymentRepository from "../repositories/paymentRepository.js";
import doctorRepository from "../repositories/doctorRepository.js";
import prescriptionRepository from "../repositories/prescriptionRepository.js";
import DoctorService from "../services/doctorService.js";

const router = express.Router();

const doctorService = new DoctorService(
  doctorRepository,
  paymentRepository,
  prescriptionRepository
);

const doctorController = new DoctorController(doctorService);

// Authorization
router.post('/register', uploadDoctorDocuments, (req, res, next) => doctorController.register(req, res, next));
router.post('/verify-otp', (req, res, next) => doctorController.verifyOtp(req, res, next));
router.post('/resend-otp', (req, res, next) => doctorController.resendOtp(req, res, next));
router.post('/login', (req, res, next) => doctorController.login(req, res, next));
router.post('/logout', (req, res, next) => doctorController.logout(req, res, next));
router.post('/pass-reset-link', (req, res, next) => doctorController.sendPassResetLink(req, res, next));
router.post('/reset-password', (req, res, next) => doctorController.resetPassword(req, res, next));

router.post('/refresh-token', (req, res, next) => doctorController.refreshToken(req, res, next));
router.get('/get-profile', verifyDoctorToken, (req, res, next) => doctorController.getProfile(req, res, next));
router.get('/get-availability', (req, res, next) => doctorController.getAvailabilities(req, res, next));
router.put('/update-profile', verifyDoctorToken, (req, res, next) => doctorController.updateProfile(req, res, next));
router.put('/add-slots', verifyDoctorToken, (req, res, next) => doctorController.addNewSlots(req, res, next));
router.delete('/delete-slot', verifyDoctorToken, (req, res, next) => doctorController.deleteSlot(req, res, next));
router.delete('/delete-timeSlot', verifyDoctorToken, (req, res, next) => doctorController.deleteTimeSlot(req, res, next));
router.get('/get-appointments', verifyDoctorToken, (req, res, next) => doctorController.getAppointments(req, res, next));
router.put('/cancel-appointment', verifyDoctorToken, (req, res, next) => doctorController.cancelAppointment(req, res, next));
router.post('/add-prescription', verifyDoctorToken, (req, res, next) => doctorController.addPrescription(req, res, next));
router.get('/get-prescription', verifyDoctorToken, (req, res, next) => doctorController.viewPrescription(req, res, next));
router.put('/update-prescription:id', verifyDoctorToken, (req, res, next) => doctorController.updatePrescription(req, res, next));
router.get('/get-user', (req, res, next) => doctorController.getSingleUser(req, res, next));

export default router;
