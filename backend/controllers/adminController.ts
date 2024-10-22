import { NextFunction, Request, Response } from "express";
import adminService from "../services/adminService.js";
import generateAdminToken from "../utils/generateAdminJwt.js";

class AdminController{
  
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email, password} = req.body;
      const admin = await adminService.authenticateAdmin(email,password,res);

      const token = generateAdminToken(res, admin._id as string);

      res.status(200).json({
        message: "Admin Login success!",
        adminId: admin._id,
        token,
      });

    } catch (error: any) {
      console.error("Admin login error: ", error.message);
      next(error)
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      await adminService.clearCookie(req,res);
      res.status(200).json({ message: 'Logout successful' });

    } catch (error: any) {
      console.error('admin Logout error:', error);
      next(error)
    }
  }

  async sendPassResetLink(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await adminService.sendResetLink(email);
      res.status(200).json({ message: 'Reset link send successful' });
    } catch (error: any) {
      console.error('admin send reset link error:', error.message);
      next(error)
    }
  }


  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
      const {token,newPassword} = req.body;
      await adminService.resetPass(token,newPassword)
      res.status(200).json({ message: "Password reset successful, please Login!" });

    } catch (error: any) {
      console.error("admin Reset password error: ", error.message);
      next(error)
    }
  }

  async listDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await adminService.getDoctors();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching doctors list error:', error);
      next(error)
    }
  }

  async approveDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log("Ac");
   
    try {
      const {email} = req.body;
      await adminService.approveDoctor(email)
      res.status(200).json({message:'Doctor Approved Succesfully'})

    } catch (error: any) {
      console.error('Approving doctor error:', error);
      next(error)
    }
  }


  async rejectDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await adminService.rejectDoctor(email)
      res.status(200).json({message:'Doctor Rejected Succesfully'})

    } catch (error: any) {
      console.error('Rejecting doctor error:', error);
      next(error)
    }
  }
}

export default new AdminController();