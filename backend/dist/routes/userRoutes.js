import express from 'express';
import userController from '../controllers/userController.js';
const router = express.Router();
//Authorization
router.post('/', userController.register);
router.post('/verify-otp', userController.verifyOtp);
router.post('/auth', userController.login);
router.post('/logout', userController.logout);
router.post('/resend-otp', userController.resendOtp);
router.post('/pass-reset-link', userController.sendPassResetLink);
router.post('/reset-password', userController.resetPassword);
export default router;
