import express from 'express';
import { uploadUserProfilePicture } from '../config/multerConfig.js';
import userController from '../controllers/userController.js';
import verifyUserToken from '../middleware/userAuthMiddleware.js';

const router = express.Router();


//Authorization
router.post('/register',uploadUserProfilePicture,userController.register)
router.post('/verify-otp',userController.verifyOtp)
router.post('/auth',userController.login)
router.post('/logout',userController.logout)
router.post('/resend-otp',userController.resendOtp)
router.post('/pass-reset-link',userController.sendPassResetLink)
router.post('/reset-password',userController.resetPassword)
router.get('/list-doctors',userController.getDoctors)
router.get('/list-top-rated-doctors',userController.getTopRatedDoctors)
router.get('/get-doc-specializations',userController.getDocSpecializations)
router.get('/view-doctor',userController.getSingleDoctor)

router.post('/refresh-token',userController.refreshToken)
router.get('/get-profile',verifyUserToken,userController.getProfile);
router.put('/update-profile',verifyUserToken,uploadUserProfilePicture,userController.updateProfile);
router.put('/book-slot',verifyUserToken, userController.bookSlot);
router.post('/check-slot',verifyUserToken, userController.checkSlot);
router.get('/get-appointments',verifyUserToken, userController.getUserAppointments);
router.post('/wallet-recharge',verifyUserToken,userController.walletRecharge);
router.get('/get-wallet',verifyUserToken,userController.getUserWallet)
router.get('/get-wallet-payments',verifyUserToken,userController.getUserWalletTransactions)
router.put('/cancel-booking',verifyUserToken, userController.cancelBooking);
router.post('/add-review',verifyUserToken,userController.addReview);
router.get('/get-doctor-reviews',userController.getReviews);
router.get('/get-prescription',verifyUserToken,userController.viewPrescription);
router.get('/get-doctor',userController.getDoctor);


router.post('/google-login',userController.googleLogin);
export default router;