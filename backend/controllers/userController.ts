import { NextFunction, Request, Response } from "express";
import userService from "../services/userService.js";

class UserController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const { name, email, phone, password } = req.body;

      const user = await userService.registerUser({ name, email, phone, password });

      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        userId: user._id,
      });

    } catch (error: any) {
      console.error("Registering user error: ", error.message);
      next(error)
    }
  }


  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email,otp } = req.body;
      const isValid = await userService.verifyOtp(email, otp );

      if (isValid) {
        await userService.activateUser(email);
        res.status(200).json({ message: "OTP verified successfully, user activated." });
      } else {
        res.status(400).json({ message: "Invalid or expired OTP." });
      }
    }
    catch (error: any){
      res.status(500).json({ message: error.message });
    }
  }
  

  async login(req: Request, res: Response, next: NextFunction): Promise<void>{
    const { email, password } = req.body;

    try{

      const result = await userService.authenticateUser(email,password,res)
      res.status(200).json({ 
        _id:result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        isVerified: result.isVerified,
        isBlocked: result.isBlocked,
      });

    }catch(error:any){

      console.error('error logging in user:',error.message);
      next(error)
    }
  }


  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      await userService.clearCookie(req,res);
      res.status(200).json({ message: 'Logout successful' });

    } catch (error: any) {

      console.error('Logout error:', error);
      next(error)
    }
  }


  async resendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await userService.updateOtp(email);
      res.status(200).json({ message: 'OTP resend successful' });
      
    } catch (error: any) {
      
      console.error('resend OTP error:', error);
      next(error)
    }
  }


  async sendPassResetLink(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await userService.sendResetLink(email);
      res.status(200).json({ message: 'Reset link send successful' });
    } catch (error: any) {
      console.error('send reset link error:', error.message);
      next(error)
    }
  }


  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const {token,newPassword} = req.body;
      await userService.resetPass(token,newPassword)
      res.status(200).json({ message: "Password reset successful, please Login!" });

    } catch (error: any) {
      console.error("Reset password error: ", error.message);
      next(error)
    }
  }
}


export default new UserController();