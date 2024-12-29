import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import dotenv from 'dotenv';
import User, { IUser } from "../models/user.js";
import Doctor,{ IDoctor } from "../models/doctor.js";
import { IWallet } from "../models/walletSchema.js";
import { IAppointment} from "../models/appointment.js";
import { IReview } from "../models/reviewSchema.js";
import sendEmail from "../utils/emailSender.js";
import { Request, Response } from "express";
import { IPayment } from "../models/paymentSchema.js";
import { IPrescription } from "../models/prescriptionSchema.js";
import { TokenPayload } from "google-auth-library";
import { GoogleTokenVerify } from "../utils/googleTokenVerify.js";

dotenv.config(); 

class UserService {
  
  async registerUser(req:Request): Promise<IUser> {

    const formData = req.body;
    const existingUser = await userRepository.findUserByEmail(formData.email);
    if (existingUser) {
        const error = Error("User already exists");
        error.name = 'ValidationError';  
        throw error;
    }
  
    const profilePicturePath = req.file?.path.replace(/\\/g, "/").replace(/^public\//, "") ?? null;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(formData.password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    const newUserData = {
      ...formData,
      profilePicture: profilePicturePath,
      password: hashedPassword,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt
      },
      isVerified: false,
    };

    const user = await userRepository.createUser(newUserData);
    await sendEmail({
      to: user.email,
      subject: "OTP Verification",
      text: `Your OTP for registration is ${otpCode}`,
    });

    return user;
  }


  async updateUser(req: any): Promise<void> {
  
    const formData = req.body;
  
    const User = await userRepository.findUserByEmail(formData.email);
  
    if(!User){
      const error = Error('No User with this email.');
      error.name = 'ValidationError';  
      throw error;
    }

    const profilePicturePath = req.file?.path.replace(/\\/g, "/").replace(/^public\//, "") ?? null;
    
    if(profilePicturePath){
      formData.profilePicture = profilePicturePath
    }
  
    await userRepository.updateUserDetails(formData);
  
  }


  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await userRepository.findUserByEmailAndOtp(email, Number(otp));

    if (!user || !user.otp || user.otp.expiresAt < new Date()) {
      return false;
    }
    return true;
  }


  async activateUser(email: string): Promise<void> {
    await userRepository.activateUser(email)
  }

  async updateOtp(email:string): Promise<void> {

    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

      await userRepository.updateOtp(email,{code:otpCode,expiresAt:otpExpiresAt});
      await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for registration is ${otpCode}`,
      });
      
    } catch (error: any) {
      console.error('Error updating OTP:', error.message || error);
      throw new Error(error.message ||'Failed to update OTP.');
    }
  }

  async authenticateUser(email: string, password: string, res: Response): Promise<IUser> {

    const User = await userRepository.findUserByEmail(email);
    if (!User) {
      const error = Error('User not found');
      error.name = 'ValidationError'
      throw error
    }

    const isPasswordMatch = await bcrypt.compare(password, User.password);
    if (!isPasswordMatch) {
      const error =  Error('Invalid credentials');
      error.name = 'ValidationError'
      throw error
    }

    if (!User.isVerified) {
      const error =  Error('Please verify your email before logging in.');
      error.name = 'ValidationError'
      throw error
    }

    if (User.isBlocked) {
      const error =  Error('Your account has been blocked. Please contact support.');
      error.name = 'ValidationError'
      throw error
    }

    
    return User;
  }
  


  async clearCookie(req: Request, res: Response): Promise<void> {
   
    try {
      res.cookie('userRefreshJwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(0),  
      });

    } catch (error: any) {
      throw new Error('Error clearing cookies');
    }
  }


  async sendResetLink(email: string): Promise<void> {

      const user = await userRepository.findUserByEmail(email)
      if (!user) {
        const error =  Error('User not found');
        error.name = 'ValidationError'
        throw error;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000)
      
      await userRepository.updateResettoken(user.email, resetToken, tokenExpiry)
      const resetLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`
      });
  }


  async resetPass(token:string, password:string): Promise<void> {
   
      const user = await userRepository.findUserByPwResetToken(token);

      if(!user){
        const error = Error('Invalid or expired token');
        error.name = 'ValidationError';  
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await userRepository.updatePassword(token,hashedPassword);
  }


  async fetchDocSpecs(): Promise<string[] | []> {

    const  Specializations = await userRepository.getAllSpecializations();
 
    if(!Specializations ){
     const error = new Error("No Specializations  found")
     error.name = 'ValidationError'
     throw error;
    }
   
    return Specializations
   }


   async fetchDoctors(): Promise<IDoctor[] | null> {

    const Doctors = await userRepository.getAllDoctors();
 
    if(!Doctors){
     const error = new Error("No doctors found")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Doctors
   }

   async fetchTopRatedDoctors(): Promise<IDoctor[] | null> {

    const Doctors = await userRepository.getTopRatedDoctors();
 
    if(!Doctors){
     const error = new Error("No top rated doctors found")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Doctors
   }


   async getSingleDoc(email:string): Promise<IDoctor | null> {

    const Doctor = await userRepository.fetchSingleDoctor(email);
 
    if(!Doctor){
     const error = new Error("No doctor with email found")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Doctor
   }


   async getUser(email:string): Promise<IUser | null> {
 
    const User = await userRepository.findUserByEmail(email);
  
    if(!User){
      const error = Error('No User with this email.');
      error.name = 'ValidationError';  
      throw error;
    }
  
    return User
  }



  
  async checkSlotAvailability(req: any): Promise<string | null> {
 
    const { slotId, timeSlotId } = req.body;
    
    // check the availability
    const status = await userRepository.checkAvailabilityStatus(slotId,timeSlotId);

    if(!status){
      const error = Error('No such a time slot available.');
      error.name = 'ValidationError';  
      throw error;
    }
  
    return status
  }


  async bookAppointment(req: any): Promise<void> {
    
    const { userEmail, slotId, timeSlotId, doctorId, paymentMethod, amount } = req.body.bookingDetails;
    const UserId = req.user.Id;
    const Doctor = await userRepository.findDoctorById(doctorId)

    // Find the availability
    const availability = await userRepository.findAvailability(slotId);

    if (!availability) {
      const error = Error('Slot has been removed or does not exist!');
      error.name = 'ValidationError';  
      throw error;
    }

    // Find the time slot to update by timeSlotId
    const timeSlot = availability.timeSlots.find((slot) => slot._id.toString() === timeSlotId);

    if (!timeSlot) {
      const error = Error('Time slot has been removed!');
      error.name = 'ValidationError';  
      throw error;
    }

    timeSlot.status = 'Booked'; 

    await availability.save();
    
    if(paymentMethod === 'Wallet'){
      let Wallet = await userRepository.findUserWallet(UserId);
      Wallet!.balance -= parseInt(amount);
      await Wallet!.save();
    }
     
    const paymentObject: Partial<IPayment> = {
      user:UserId,
      doctor:doctorId,
      amount,
      method:paymentMethod,
      transactionType:'Booking',
      status:'Completed'
    }
    const payment = await userRepository.createPayment(paymentObject);
    

    //create appointment
    const appointmentObject: Partial<IAppointment> = {
      user: UserId,
      doctor: doctorId,
      date: availability.date,
      time: timeSlot.time,
      slotId,
      timeSlotId,
      payment: payment._id,
      status: 'Booked'
    }

    await userRepository.createAppointment(appointmentObject) 
    
    //Send booking details to user
    await sendEmail({
      to: userEmail,
      subject: 'Appointment Details',
      html: `<h3>Your Appointment is Confirmed</h3>
            <p><strong>Doctor:</strong> Dr. ${Doctor?.name}</p>
            <p><strong>Date:</strong> ${availability.date.toLocaleDateString('en-GB')}</p>
            <p><strong>Time:</strong> ${timeSlot.time}</p>
            <p><strong>Payment:</strong> ₹${amount} via ${paymentMethod}</p>
            <p>Thank you for choosing us!</p>
            <p>Best Regards,</p>
            <p>${Doctor?.address?.clinicName}</p>`
    });
  }


  async cancelAppointment(req: any): Promise<void> {
  
    const { bookingId } = req.body;
    const UserId = req.user.Id;
  
    console.log("at service: ",bookingId,UserId);

    const appointment = await userRepository.findAppointment(bookingId);
    if(!appointment){
      const error = Error('No appointment with the provided bookingId');
      error.name = 'ValidationError';  
      throw error;
    }

    
    //change the slot status to available
    const updatedStatus = "Available";
    await userRepository.updateTimeSlot(appointment.timeSlotId, updatedStatus);
    
    //do the refund and add new payment document
    const paymentAmount = (appointment.payment as IPayment)?.amount;
    let UserWallet = await userRepository.findUserWallet(UserId);
    if(!UserWallet){
      const walletObject: Partial<IWallet> = {
        ownerId: UserId,
        ownerType: 'User',
      }
      UserWallet = await userRepository.createUserWallet(walletObject)
    }
    UserWallet!.balance += paymentAmount;
    await UserWallet!.save();
  
    const paymentObject: Partial<IPayment> = {
      user:UserId,
      doctor:appointment.doctor,
      amount:paymentAmount,
      method:'Wallet',
      transactionType:'Refund',
      status:'Completed'
    }
    const payment = await userRepository.createPayment(paymentObject);

    //update appointment document and save
    appointment.status = 'Cancelled'
    appointment.payment = payment._id
    await appointment.save()
  
  }

  
  async getAppointments(userId:string): Promise<IAppointment[] | null> {
 
    const Appointments = await userRepository.getUserAppointments(userId);
  
    if(!Appointments){
      const error = Error('No Appointments for this user');
      error.name = 'ValidationError';  
      throw error;
    }
  
    return Appointments
  }


   
  async rechargeWallet(req: any): Promise<void> {
    
    const {amount} = req.body;
    const UserId = req.user.Id;
  
    let Wallet = await userRepository.findUserWallet(UserId);

    if(!Wallet){
      const walletObject: Partial<IWallet> = {
        ownerId: UserId,
        ownerType: 'User',
      }
      Wallet = await userRepository.createUserWallet(walletObject)
    }
    
    Wallet.balance += parseInt(amount)
    await Wallet.save();

    const paymentObject: Partial<IPayment> = {
      user:UserId,
      amount,
      method:'Razorpay',
      transactionType: 'Recharge',
      status:'Completed'
    }

    await userRepository.createPayment(paymentObject);
  }


  async getWallet(req:any): Promise<IWallet | null> {
    
    const UserId = req.user.Id;
    const wallet = await userRepository.findUserWallet(UserId);
  
    if(!wallet){
      const error = Error('No wallet for this user');
      error.name = 'ValidationError';  
      throw error;
    }
  
    return wallet
  }


  async getWalletTransactions(req:any): Promise<IPayment[] | null> {
    
    const UserId = req.user.Id;
    const transactions = await userRepository.getUserWalletPayments(UserId);
  
    return transactions
  }
  
  
  async addDoctorReview(req:any): Promise<void> {
    
    const { doctorId, rating, comment } = req.body;
    const UserId = req.user.Id;
    
    if (!doctorId || !UserId || !rating || !comment) {
      const error = Error('All fields are required.');
      error.name = 'ValidationError';  
      throw error;
    }
  
    const newReview: Partial<IReview> = {
      doctorId,
      patientId:UserId,
      comment,
      rating,
    };

    await userRepository.createReview(newReview);

    const reviews = await userRepository.getReviews(doctorId);

    // Calculate the new average rating and review count
    const totalRatings = reviews!.reduce((sum, review) => sum + review.rating, 0);
    
    const newAverage = totalRatings / reviews!.length;

    console.log("new avg is: ", newAverage);
    
    // Step 4: Update the doctor's ratingInfo
    const doctor = await Doctor.findById(doctorId);
    doctor!.ratingInfo.average = newAverage;
    doctor!.ratingInfo.count = reviews!.length;

    // Step 5: Save the updated doctor document
    await doctor!.save();
  }



  async getDoctorReviews(req: Request): Promise<IReview[] | null> {

    const { docId } = req.query;
    const Reviews = await userRepository.getReviews(docId);

    if(!Reviews){
      const error = Error('No reviews for this doctor');
      error.name = 'ValidationError';  
      throw error;
    }
  
    return Reviews
  }


  async getPrescription(req: Request): Promise<IPrescription | null> {  

    const { Pr_Id } = req.query;
    const prescription = await userRepository.findPrescription(Pr_Id);
  
    if(!prescription){
      const error = Error('No prescription found with this id');
      error.name = 'ValidationError';  
      throw error;
    }
    
    return prescription
  }


  async fetchSingleDoctor(req:Request): Promise<IDoctor | null> {

    const { docId } = req.query;
    if(!docId){
      const error = new Error("No doctor id provided")
      error.name = 'ValidationError'
      throw error;
    }

    const Doctor = await userRepository.findDoctorById(docId);
 
    if(!Doctor){
     const error = new Error("No doctor found with this id")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Doctor
   }



   async googleLogin(googleToken: string, res: Response): Promise<IUser> {

    try {
      const payload: TokenPayload | undefined = await GoogleTokenVerify(googleToken);
      
      if (!payload) {
        throw new Error('Failed to verify Google token');
      }
  
      const { email, name } = payload;
      if (!email || !name) {
        throw new Error('Email and name is required from Google token');
      }

      let GoogleUser = await userRepository.findUserByEmail(email);
      if(!GoogleUser){
        GoogleUser = await userRepository.createGoogleUser(email,name)
      }
      
      return GoogleUser;

    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Error occured during Google login');
    }
  }
}

export default new UserService();
