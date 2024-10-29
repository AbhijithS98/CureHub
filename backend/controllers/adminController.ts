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

  async listUnapprovedDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await adminService.getUnapprovedDoctors();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching unapproved doctors list error:', error);
      next(error)
    }
  }

  async approveDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
   
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



  async listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await adminService.getUsers();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching Users list error:', error);
      next(error)
    }
  }


  async blockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
   console.log("hit blockkkkkkk");
   
    try {
      const {email} = req.body;
      console.log("user email: ",email);
      
      await adminService.blockUser(email)
      res.status(200).json({message:'User blocked Succesfully'})

    } catch (error: any) {
      console.error('Blocking user error:', error);
      next(error)
    }
  }


  async unblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await adminService.unblockUser(email)
      res.status(200).json({message:'User unblocked Succesfully'})

    } catch (error: any) {
      console.error('unBlocking user error:', error);
      next(error)
    }
  }

  async blockDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
 
     try {
       const {email} = req.body;
       console.log("Doctor email: ",email);
       
       await adminService.blockDoctor(email)
       res.status(200).json({message:'Doctor blocked Succesfully'})
 
     } catch (error: any) {
       console.error('Blocking Doctor error:', error);
       next(error)
     }
   }

   async unblockDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {
      const {email} = req.body;
      await adminService.unblockDoctor(email)
      res.status(200).json({message:'Doctor unblocked Succesfully'})

    } catch (error: any) {
      console.error('unBlocking Doctor error:', error);
      next(error)
    }
  }
}

export default new AdminController();