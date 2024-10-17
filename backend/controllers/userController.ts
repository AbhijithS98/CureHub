import { Request, Response } from "express";
import userService from "../services/userService.js";

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, password } = req.body;

      const user = await userService.registerUser({ name, email, phone, password });

      res.status(201).json({
        message: "User registered successfully. Please verify your email.",
        userId: user._id,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  

  async verifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { email,otp } = req.body;
      const isValid = await userService.verifyOtp({ email, otp });

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
  
}


export default new UserController();