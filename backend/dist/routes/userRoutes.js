import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();
//Authorization
router.post('/', userController.register);
router.post('/verify-otp', userController.verifyOtp);
export default router;
