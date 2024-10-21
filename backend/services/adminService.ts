import { Request, Response } from "express";
import { IAdmin } from "../models/admin.js";
import { IDoctor } from "../models/doctor.js";
import adminRepository from "../repositories/adminRepository.js";
import bcrypt from 'bcryptjs'
import generateAdminToken from "../utils/generateAdminJwt.js";
import { ObjectId } from "mongoose";

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
    
    generateAdminToken(res, admin._id as string)
    return admin
  }


  async clearCookie(req: Request, res: Response): Promise<void> {

    try {
      res.cookie('adminJwt', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        expires: new Date(0),  
      });

    } catch (error: any) {
      throw new Error('Error clearing cookies');
    }
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

  async approveDoctor(email:string):Promise<void>{
    console.log("As");

    const doctor = await adminRepository.findDoctorByEmail(email);
    if(!doctor){
      const error = new Error("No doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.approveDoc(email);
    
  }


  async rejectDoctor(email:string):Promise<void>{
    console.log("As");

    const doctor = await adminRepository.findDoctorByEmail(email);
    if(!doctor){
      const error = new Error("No doctor found with the email")
      error.name = 'ValidationError'
      throw error;
    }

    await adminRepository.deleteDoctor(email);
  }
}


export default new AdminService();
