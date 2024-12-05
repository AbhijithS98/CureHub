import { Request, Response } from "express";
import { IAdmin } from "../models/admin.js";
import { IDoctor } from "../models/doctor.js";
import { IUser } from "../models/user.js";
import adminRepository from "../repositories/adminRepository.js";
import sendEmail from "../utils/emailSender.js";
import bcrypt from 'bcryptjs'
import crypto from 'crypto';
import { IAppointment } from "../models/appointment.js";
import { IPayment } from "../models/paymentSchema.js";


class AdminService{
  
  async authenticateAdmin(email: string, password: string, res: Response): Promise<IAdmin> {
    
    const admin = await adminRepository.findAdminByEmail(email);

    if(!admin){
      const error = new Error("Admin not found with given email")
      error.name = 'ValidationError'
      throw error;
    }
    
    const isMatching = await bcrypt.compare(password, admin.password);

    if(!isMatching){
      const error = new Error("Incorrect password")
      error.name = 'ValidationError'
      throw error;
    }
    
    return admin
  }


  async clearCookie(req: Request, res: Response): Promise<void> {

    try {
      res.cookie('adminRefreshJwt', '', {
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

    const admin = await adminRepository.findAdminByEmail(email)
    if (!admin) {
      const error =  Error('doctor not found');
      error.name = 'ValidationError'
      throw error;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000)
    
    await adminRepository.updateResettoken(admin.email, resetToken, tokenExpiry)
    const resetLink = `${process.env.FRONTEND_URL}/admin/reset-password?token=${resetToken}`;

    await sendEmail({
      to: admin.email,
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click the link below to reset your password:</p>
             <a href="${resetLink}">Reset Password</a>`
    });
  }


  async resetPass(token:string, password:string): Promise<void> {
    
    const admin = await adminRepository.findAdminByPwResetToken(token);

    if(!admin){
      const error = Error('Invalid or expired token');
      error.name = 'ValidationError';  
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await adminRepository.updatePassword(token,hashedPassword);
  }


  async getDoctors(): Promise<IDoctor[] | null> {

    const Doctors = await adminRepository.getAllDoctors();
 
    if(!Doctors){
     const error = new Error("No doctors found")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Doctors
   }


  async getUnapprovedDoctors(): Promise<IDoctor[] | null> {

   const Doctors = await adminRepository.getAllUnapprovedDoctors();

   if(!Doctors){
    const error = new Error("No doctors found")
    error.name = 'ValidationError'
    throw error;
  }
  
   return Doctors
  }

  async approveDoctor(email:string):Promise<void>{

    const doctor = await adminRepository.findDoctorByEmail(email);
    if(!doctor){
      const error = new Error("No doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.approveDoc(email);
    
  }


  async rejectDoctor(email:string):Promise<void>{

    const doctor = await adminRepository.findDoctorByEmail(email);
    if(!doctor){
      const error = new Error("No doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.deleteDoctor(email);
  }


  async getUsers(): Promise<IUser[] | null> {

    const Users = await adminRepository.getAllUsers();
    
    if(!Users){
     const error = new Error("No Users found")
     error.name = 'ValidationError'
     throw error;
   }
   
    return Users
   }


   async blockUser(email:string):Promise<void>{

    const user = await adminRepository.findUserByEmail(email);
    if(!user){
      const error = new Error("No user found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.blockUser(email); 
  }

  async unblockUser(email:string):Promise<void>{

    const user = await adminRepository.findUserByEmail(email);
    if(!user){
      const error = new Error("No user found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.unblockUser(email); 
  }

  async blockDoctor(email:string):Promise<void>{

    const Doctor = await adminRepository.findDoctorByEmail(email);
    if(!Doctor){
      const error = new Error("No Doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.blockDoctor(email); 
  }

  async unblockDoctor(email:string):Promise<void>{

    const Doctor = await adminRepository.findDoctorByEmail(email);
    if(!Doctor){
      const error = new Error("No Doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.unblockDoctor(email); 
  }


  async getAppointments(): Promise<IAppointment[] | null> {

    const Appointments = await adminRepository.getAllAppointments();
       
    return Appointments;
   }

  async getUsersCount(): Promise<number | null> {
   
    const UsersCount = await adminRepository.getAllUsersCount();
    return UsersCount;
  }

  async getDoctorsCount(): Promise<number | null> {
   
    const DoctorsCount = await adminRepository.getAllDoctorsCount();
    return DoctorsCount;
  }

  async getAllAppointmentStats(): Promise<{ 
    active: number | null; 
    completed: number | null; 
    cancelled: number | null 
  }> {
    const ActiveAppointmentsCount = await adminRepository.getActiveAppointmentsCount();
    const CompletedAppointmentsCount = await adminRepository.getCompletedAppointmentsCount();
    const CancelledAppointmentsCount = await adminRepository.getCancelledAppointmentsCount();
    
    return {
      active: ActiveAppointmentsCount,
      completed: CompletedAppointmentsCount,
      cancelled: CancelledAppointmentsCount,
    };
  }

  async getAllRefundTransactionsCount(): Promise<number | null> {
   
    const RefundTransactionsCount = await adminRepository.getRefundTransactionsCount();
    return RefundTransactionsCount;
  }

  async getTotalRevenue(): Promise<{ _id: null, total: number }[] | []> {
   
    const TotalRevenue = await adminRepository.getTotalRevenue();
    return TotalRevenue;
  }


  async getAppointmentTrends(): Promise<any[] | []> {
   
    const AppointmentTrends = await adminRepository.getAppointmentsChartData();
    return AppointmentTrends;
  }


  async getRevenueTrends(): Promise<any[] | []> {
   
    const RevenueTrends = await adminRepository.getRevenueChartData();
    return RevenueTrends;
  }



  async getAppointmentReportData(req: Request): Promise<IAppointment[] | []> {
   
    const AppointmentReports = await adminRepository.getAppointmentReports(req);
    return AppointmentReports;
  }

  async getRevenueReportData(req: Request): Promise<IPayment[] | []> {
   
    const RevenueReports = await adminRepository.getRevenueReports(req);
    return RevenueReports;
  }
}



export default new AdminService();
