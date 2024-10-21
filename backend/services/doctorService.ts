import { IDoctor } from "../models/doctor.js";
import doctorRepository from "../repositories/doctorRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
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
}

export default new DoctorService();