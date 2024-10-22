import { IDoctor } from "../models/doctor.js";
import doctorRepository from "../repositories/doctorRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { Request, Response } from "express";


class DoctorService {

  async registerDoctor(req: Request): Promise<IDoctor> {
      
    const formData = req.body;
    const { email, password } = formData;
    
    const existingDoctor = await doctorRepository.findDoctorByEmail(email);
    if (existingDoctor) {
        const error = Error("Doctor already exists");
        error.name = 'ValidationError';  
        throw error;
    }
    
    const idProofPath = req.file?.path;
    if (!idProofPath) {
        const error = Error('ID proof is required');
        error.name = 'ValidationError';  
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    const newDoctorData = {
      ...formData,
      password: hashedPassword,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt
      },
      idProof: idProofPath,
      isVerified: false,
    };

    const doctor = await doctorRepository.createDoctor(newDoctorData);
    await sendEmail({
      to: doctor.email,
      subject: "OTP Verification",
      text: `Your OTP for registration is ${otpCode}`,
    });

    return doctor;
  }



  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const doctor = await doctorRepository.findDoctorByEmailAndOtp(email, Number(otp));

    if (!doctor || !doctor.otp || doctor.otp.expiresAt < new Date()) {
      return false;
    }
    return true;
  }


  async markVerifiedDoctor(email: string): Promise<void> {
    await doctorRepository.markVerifiedDoctor(email)
  }


  async updateOtp(email:string): Promise<void> {

    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

      await doctorRepository.updateOtp(email,{code:otpCode,expiresAt:otpExpiresAt});
      await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for doctor registration is ${otpCode}`,
      });
      
    } catch (error: any) {
      console.error('Error updating OTP:', error.message || error);
      throw new Error(error.message ||'Failed to update OTP.');
    }
  }


  async authenticateDoctor(email: string, password: string, res: Response): Promise<IDoctor> {

    const doctor = await doctorRepository.findDoctorByEmail(email);
    if (!doctor) {
      const error = Error('Doctor not found');
      error.name = 'ValidationError'
      throw error
    }

    const isPasswordMatch = await bcrypt.compare(password, doctor.password);
    if (!isPasswordMatch) {
      const error =  Error('Invalid credentials');
      error.name = 'ValidationError'
      throw error
    }

    if (!doctor.isVerified) {
      const error =  Error('Please verify your email before logging in.');
      error.name = 'ValidationError'
      throw error
    }

    if (!doctor.isApproved) {
      const error =  Error('You are not Approved by the admin yet!');
      error.name = 'ValidationError'
      throw error
    }

    if (doctor.isBlocked) {
      const error =  Error('Your account has been blocked. Please contact support.');
      error.name = 'ValidationError'
      throw error
    }

    
    return doctor;
  }


  async clearCookie(req: Request, res: Response): Promise<void> {
   
    try {
      res.cookie('doctorJwt', '', {
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

    const doctor = await doctorRepository.findDoctorByEmail(email)
    if (!doctor) {
      const error =  Error('doctor not found');
      error.name = 'ValidationError'
      throw error;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000)
    
    await doctorRepository.updateResettoken(doctor.email, resetToken, tokenExpiry)
    const resetLink = `${process.env.FRONTEND_URL}/doctor/reset-password?token=${resetToken}`;

    await sendEmail({
      to: doctor.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`
    });
}


async resetPass(token:string, password:string): Promise<void> {
   
  const doctor = await doctorRepository.findDoctorByPwResetToken(token);

  if(!doctor){
    const error = Error('Invalid or expired token');
    error.name = 'ValidationError';  
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await doctorRepository.updatePassword(token,hashedPassword);
}
}

export default new DoctorService();