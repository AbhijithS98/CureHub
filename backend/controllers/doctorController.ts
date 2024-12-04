import { NextFunction, Request, Response } from "express";
import doctorService from "../services/doctorService.js";
import generateDoctorTokens from "../utils/generateDoctorJwt.js";
import verifyRefreshToken from "../utils/refreshToken.js";


class DoctorController {
   
  async register(req:any, res: Response, next: NextFunction): Promise<void> {
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


  async login(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { email, password } = req.body;
    try {

      const result = await doctorService.authenticateDoctor(email,password,res)
      const token = generateDoctorTokens(res,result._id as string)

      res.status(200).json({ 
        _id:result._id,
        name: result.name,
        email: result.email,
        specialization: result.specialization,
        medicalLicenseNumber: result.medicalLicenseNumber,
        experience: result.experience,
        phone: result.phone,
        isVerified: result.isVerified,
        isApproved: result.isApproved,
        isBlocked: result.isBlocked,
        token,
      });
      
    } catch (error: any) {

      console.error('error logging in doctor:',error.message);
      next(error)
    }
  }


  async refreshToken(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies.doctorRefreshJwt;
  
    if (!refreshToken) {
      res.status(401).json({ message: 'No doctorRefresh token provided, authorization denied' });
      return;
    } 
  
      const newAccessToken = verifyRefreshToken(refreshToken,'doctor',res)
      console.log("doctor token has refreshed");
      
    if(newAccessToken) {  
      res.status(200).json({ token: newAccessToken });
    }
  };




  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      await doctorService.clearCookie(req,res);
      res.status(200).json({ message: 'Logout successful' });

    } catch (error: any) {

      console.error('Logout error:', error);
      next(error)
    }
  }


  async sendPassResetLink(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await doctorService.sendResetLink(email);
      res.status(200).json({ message: 'Reset link send successful' });

    } catch (error: any) {
      console.error('doctor send reset link error:', error.message);
      next(error)
    }
  }


  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const {token,newPassword} = req.body;
      await doctorService.resetPass(token,newPassword)
      res.status(200).json({ message: "Password reset successful, please Login!" });

    } catch (error: any) {
      console.error("Doctor Reset password error: ", error.message);
      next(error)
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const email = req.query.email as string | undefined;
   
      if (!email) {
        res.status(400).json({ message: "Email is required" });
        return;
      }  
      
      console.log("doctor's email is: ",email);
      const doctor = await doctorService.getDoctor(email)
      res.status(200).json({doctor});

    } catch (error: any) {
      console.error("Getting doctor profile error: ", error.message);
      next(error)
    }
  }


  async getAvailabilities(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const _id = req.query._id as string | undefined;
   
      if (!_id) {
        res.status(400).json({ message: "Doctor id is required" });
        return;
      }  
      
      const availability = await doctorService.getAvailability(_id)
      res.status(200).json({availability});

    } catch (error: any) {
      console.error("Getting doctor availability error: ", error.message);
      next(error)
    }
  }


  async updateProfile(req:any, res: Response, next: NextFunction): Promise<void> {
    console.log('entered doctor updation');
    
     try {
       await doctorService.updateDoctor(req);
       res.status(200).json({ message: 'Doctor details updated successfully.'});
 
     } catch (error: any) {
       console.error("Updating doctor error: ", error.message);
       next(error)
     }
   }

   
   async addNewSlots(req:any, res: Response, next: NextFunction): Promise<void> {
    console.log('entered slot updation');
     
     try {

       await doctorService.updateSlots(req);
       res.status(200).json({ message: 'Slots added successfully.'});
 
     } catch (error: any) {
       console.error("Updating slot error: ", error.message);
       next(error)
     }
   }

   async deleteSlot(req:any, res: Response, next: NextFunction): Promise<void> {
     
     try {

       await doctorService.removeSlot(req);
       res.status(200).json({ message: 'Slot deleted successfully.'});
 
     } catch (error: any) {
       console.error("deleting slot error: ", error.message);
       next(error)
     }
   }


   async deleteTimeSlot(req:any, res: Response, next: NextFunction): Promise<void> {
     
     try {

       await doctorService.removeTimeSlot(req);
       res.status(200).json({ message: 'Time Slot deleted successfully.'});
 
     } catch (error: any) {
       console.error("deleting time slot error: ", error.message);
       next(error)
     }
   }




   async getAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const doc_id = req.doctor?.Id as string;   
      const appointments = await doctorService.fetchAppointments(doc_id)
      res.status(200).json({appointments});

    } catch (error: any) {
      console.error("Getting doctor appointments error: ", error.message);
      next(error)
    }
  }


  async cancelAppointment(req:any, res: Response, next: NextFunction): Promise<void> {
    
    try {
      console.log("at doc controller");
      
      await doctorService.cancelBooking(req);
      res.status(200).json({ message: "booking cancelled successfully."});

    } catch (error: any) {
      console.error("doctor cancel booking error: ", error.message);
      next(error)
    }
  }


  async addPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
         
      await doctorService.addPatientPrescription(req)
      res.status(200).json({ message: "prescription added successfully."});

    } catch (error: any) {
      console.error("adding prescription error: ", error.message);
      next(error)
    }
  }


  async viewPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
        
      const result = await doctorService.getPrescription(req)
      res.status(200).json({result});

    } catch (error: any) {
      console.error("Getting single prescription error: ", error.message);
      next(error)
    }
  }


  async updatePrescription(req:Request, res: Response, next: NextFunction): Promise<void> {
  
     try {
       await doctorService.updatePrescription(req);
       res.status(200).json({ message: 'Prescription updated successfully.'});
 
     } catch (error: any) {
       console.error("Updating prescription error: ", error.message);
       next(error)
     }
   }



   
   async getSingleUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
       
      const data = await doctorService.fetchUser(req);
      res.status(200).json({data});

    } catch (error: any) {
      console.error("Getting single user error: ", error.message);
      next(error)
    }
  }

}

export default new DoctorController();

