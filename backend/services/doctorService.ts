import { IDoctor } from "../models/doctor.js";
import { IAvailability } from "../models/availability.js";
import doctorRepository from "../repositories/doctorRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import { Request, Response } from "express";
import { IPayment } from "../models/paymentSchema.js";
import { IAppointment } from "../models/appointment.js";
import { IPrescription } from "../models/prescriptionSchema.js";
import { IUser } from "../models/user.js";



class DoctorService {

  async registerDoctor(req: any): Promise<IDoctor> {
      
    const formData = req.body;
    const { email, password } = formData;
    
    const existingDoctor = await doctorRepository.findDoctorByEmail(email);
    if (existingDoctor) {
        const error = Error("Doctor already exists");
        error.name = 'ValidationError';  
        throw error;
    }
    
    const idProofPath = req.files? req.files['idProof'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;
    const medicalDegreePath = req.files? req.files['medicalDegree'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;
    const profilePicturePath = req.files? req.files['profilePicture'][0].path.replace(/\\/g, '/').replace(/^public\//, '') : null;

    if (!idProofPath || !medicalDegreePath || !profilePicturePath) {
        const error = Error('All files (ID proof, Medical Degree, profilePicture) are required');
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
      profilePicture: profilePicturePath,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt
      },
      documents: {
        idProof: idProofPath,
        medicalDegree: medicalDegreePath,
      },
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
      res.cookie('doctorRefreshJwt', '', {
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

async getDoctor(email:string): Promise<IDoctor | null> {
 
  const Doctor = await doctorRepository.findDoctorByEmail(email);

  if(!Doctor){
    const error = Error('No doctor with this email.');
    error.name = 'ValidationError';  
    throw error;
  }

  return Doctor
}


async getAvailability(_id:string): Promise<IAvailability[] | null> {
 
  const availabilities = await doctorRepository.getAvailabilities(_id);

  if(!availabilities){
    const error = Error('No availabilities for this doctor.');
    error.name = 'ValidationError';  
    throw error;
  }
  
  return availabilities
}


async updateDoctor(req: any): Promise<void> {
  
    const { email } = req.body;

    const Doctor = await doctorRepository.findDoctorByEmail(email);

    if(!Doctor){
      const error = Error('No doctor with this email.');
      error.name = 'ValidationError';  
      throw error;
    }
  
    await doctorRepository.updateDoctorDetails(req);

}

async updateSlots(req: any): Promise<void> {
  
  const { email } = req.query;
  const { newSlots } = req.body;
  console.log("slots are: ",newSlots);
  

  const Doctor = await doctorRepository.findDoctorByEmail(email);

  if(!Doctor){
    const error = Error('No doctor with this email.');
    error.name = 'ValidationError';  
    throw error;
  }

  await doctorRepository.addSlots(email,newSlots);
}


  async removeSlot(req: any): Promise<void> {
    
    const { slotId } = req.body;

    if(!slotId){
      const error = Error('slot id must be provided');
      error.name = 'ValidationError';  
      throw error;
    }

    await doctorRepository.deleteSlot(slotId);
  }


  async removeTimeSlot(req: any): Promise<void> {
    
    const { slotId, timeSlotId } = req.body;

    if(!slotId || !timeSlotId){
      const error = Error('SlotId and TimeSlotId must be provided');
      error.name = 'ValidationError';  
      throw error;
    }

    await doctorRepository.deleteTimeSlot(slotId,timeSlotId);
  }



  
async fetchAppointments(_id:string): Promise<IAppointment[] | null> {
 
  const appointments = await doctorRepository.getAppointments(_id);

  if(!appointments){
    const error = Error('No appointments for this doctor.');
    error.name = 'ValidationError';  
    throw error;
  }
  
  return appointments
}


  async cancelBooking(req: any): Promise<void> {
    
    const { appointmentId, reason } = req.body;
    console.log("apnt id :",appointmentId,"rs: ", reason);

    const appointment = await doctorRepository.findAppointment(appointmentId);
    if(!appointment){
      const error = Error('No appointment with the provided bookingId');
      error.name = 'ValidationError';  
      throw error;
    }

    //delete the time slot from availability
    const slotId = appointment.slotId.toString();
    const timeSlotId = appointment.timeSlotId.toString();
    await doctorRepository.deleteTimeSlot(slotId,timeSlotId);
    
    //do the refund and add new payment document
    const paymentAmount = (appointment.payment as IPayment)?.amount;
    const Wallet = await doctorRepository.findUserWallet(appointment.user);
    Wallet!.balance += paymentAmount;
    await Wallet!.save();

    const paymentObject: Partial<IPayment> = {
      user:appointment.user,
      doctor:appointment.doctor,
      amount:paymentAmount,
      method:'Wallet',
      transactionType:'Refund',
      status:'Completed'
    }
    const payment = await doctorRepository.createPayment(paymentObject);

    //update appointment document and save
    appointment.status = 'Cancelled'
    appointment.payment = payment._id
    appointment.cancellationReason = reason
    await appointment.save()

    //Send notification mail
    const user = await doctorRepository.findUserById(appointment.user)
    const Doctor = await doctorRepository.findDoctorById(appointment.doctor)
    await sendEmail({
      to: user!.email,
      subject: 'Appointment Cancellation Notification',
      html: `<h3>Your Appointment Has Been Cancelled</h3>
        <p>Dear ${user!.name},</p>
        <p>We regret to inform you that your appointment has been cancelled. Below are the details:</p>
        <p><strong>Doctor:</strong> Dr. ${Doctor!.name}</p>
        <p><strong>Date:</strong> ${appointment.date.toLocaleDateString('en-GB')}</p>
        <p><strong>Time:</strong> ${appointment.time}</p>
        <p><strong>Cancellation Reason:</strong> ${reason}</p>
        <p><strong>Refund:</strong> ₹${paymentAmount} has been refunded to your wallet.</p>
        <p>You can use the wallet balance for future bookings or other services.</p>
        <p>We apologize for any inconvenience caused and appreciate your understanding.</p>
        <p>Best Regards,</p>
        <p>${Doctor!.address!.clinicName}</p>`
    });
  }


  async addPatientPrescription(req: Request): Promise<void> {
  
    const doc_id = req.doctor?.Id as string;
    const { prescriptionData } = req.body;
    console.log("prescription is: ", prescriptionData);
    
    prescriptionData.doctor = doc_id;
    const response = await doctorRepository.createPrescription(prescriptionData);
    if(response){
      console.log("prescription created: ", response);    
    }
    
    const Appointment = await doctorRepository.findAppointment(prescriptionData.appointment);
    if(Appointment){
      Appointment.prescription = response._id;
      Appointment.status = 'Completed'
      await Appointment.save();
    }
    
  }


  async getPrescription(req: Request): Promise<IPrescription | null> {  

    const { Pr_Id } = req.query;
    const prescription = await doctorRepository.findPrescription(Pr_Id);
  
    if(!prescription){
      const error = Error('No prescription found with this id');
      error.name = 'ValidationError';  
      throw error;
    }
    
    return prescription
  }


  async updatePrescription(req: Request): Promise<void> {
    
    const { id } = req.params;
    const updateFields = req.body;

    const Prescription = await doctorRepository.findPrescription(id);

    if(!Prescription){
      const error = Error('No Prescription with this id');
      error.name = 'ValidationError';  
      throw error;
    }
  
    await doctorRepository.updateUserPrescription(id,updateFields);
  }



  async fetchUser(req: Request): Promise<IUser | null> {  

    const { userId } = req.query;
    if(!userId){
      const error = Error('No user id provided');
      error.name = 'ValidationError';  
      throw error;
    }

    const User = await doctorRepository.findUserById(userId);  
    if(!User){
      const error = Error('No User found with this id');
      error.name = 'ValidationError';  
      throw error;
    }
    
    return User;
  }
}

export default new DoctorService();