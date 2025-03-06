import express from 'express';
import { uploadDoctorDocuments } from '../config/multerConfig.js';
import verifyDoctorToken from '../middleware/doctorAuthMiddleware.js';

import DoctorRepository from "../repositories/doctorRepository.js";
import DoctorController from '../controllers/doctorController.js';
import DoctorService from "../services/doctorService.js";

import PrescriptionRepository from "../repositories/prescriptionRepository.js";
import PrescriptionService from '../services/prescriptionService.js';
import PrescriptionController from '../controllers/prescriptionController.js';

import PaymentRepository from "../repositories/paymentRepository.js";


const router = express.Router();

//Initializing Doctor service and Doctor controller
const doctorService = new DoctorService(
  DoctorRepository,
  PaymentRepository,
  PrescriptionRepository
);
const doctorController = new DoctorController(doctorService);

//Initializing Prescription service and Prescription controller
const prescriptionService = new PrescriptionService(PrescriptionRepository);
const prescriptionController = new PrescriptionController(prescriptionService);

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
router.get('/get-user', (req, res, next) => doctorController.getSingleUser(req, res, next));


router.get('/get-prescription', verifyDoctorToken, (req, res, next) => prescriptionController.viewPrescription(req, res, next));
router.put('/update-prescription:id', verifyDoctorToken, (req, res, next) => prescriptionController.updatePrescription(req, res, next));

export default router;
