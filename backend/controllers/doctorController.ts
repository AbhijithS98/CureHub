import { NextFunction, Request, Response } from "express";
import doctorService from "../services/doctorService.js";

class DoctorController {
   
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log('entered doctor register');
   
    try {
      const doctor = await doctorService.registerDoctor(req);
      res.status(201).json({ message: 'Doctor registered successfully. Please verify your email',
        doctorId: doctor._id,
       });

    } catch (error: any) {
      console.error("Registering doctor error: ", error.message);
      next(error)
    }
  }


  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email,otp } = req.body;
      const isValid = await doctorService.verifyOtp(email, otp );

      if (isValid) {
        await doctorService.markVerifiedDoctor(email);
        res.status(200).json({ message: "OTP verified successfully." });
      } else {
        res.status(400).json({ message: "Invalid or expired OTP." });
      }
    }
    catch (error: any){
      res.status(500).json({ message: error.message });
    }
  }


  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await doctorService.updateOtp(email);
      res.status(200).json({ message: 'OTP resend successful' });
      
    } catch (error: any) {
      
      console.error('resend OTP error:', error);
      next(error)
    }
  }
}

export default new DoctorController();

