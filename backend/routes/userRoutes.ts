import express from 'express';
import userController from '../controllers/userController.js';
import verifyUserToken from '../middleware/userAuthMiddleware.js';

const router = express.Router();


//Authorization
router.post('/register',userController.register)
router.post('/verify-otp',userController.verifyOtp)
router.post('/auth',userController.login)
router.post('/logout',userController.logout)
router.post('/resend-otp',userController.resendOtp)
router.post('/pass-reset-link',userController.sendPassResetLink)
router.post('/reset-password',userController.resetPassword)
router.get('/list-doctors',userController.getDoctors)
router.get('/get-doc-specializations',userController.getDocSpecializations)
router.get('/view-doctor',userController.getSingleDoctor)

router.post('/refresh-token',userController.refreshToken)
router.get('/get-profile', verifyUserToken, userController.getProfile);
router.put('/update-profile', verifyUserToken, userController.updateProfile);


export default router;