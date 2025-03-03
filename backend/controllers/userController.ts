import { NextFunction, Request, Response } from "express";
import generateUserTokens from "../utils/generateUserJwt.js";
import verifyRefreshToken from "../utils/refreshToken.js";
import paymentRepository from "../repositories/paymentRepository.js";
import prescriptionRepository from "../repositories/prescriptionRepository.js";
import { UserService } from "../services/userService.js";

const userService = new UserService(paymentRepository,prescriptionRepository);

class UserController {

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const { name, email, phone, password } = req.body;

      const user = await userService.registerUser(req);

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

      const token = generateUserTokens(res,result._id as string)

      res.status(200).json({ 
        _id:result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        isVerified: result.isVerified,
        isBlocked: result.isBlocked,
        token,
      });

    }catch(error:any){

      console.error('error logging in user:',error.message);
      next(error)
    }
  }



  async refreshToken(req: Request, res: Response): Promise<void>{
    const refreshToken = req.cookies.userRefreshJwt;
  
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token provided, authorization denied' });
      return;
    } 
  
      const newAccessToken = verifyRefreshToken(refreshToken,'user',res)
      console.log("token has refreshed");
      
    if(newAccessToken) {  
      res.status(200).json({ token: newAccessToken });
    }
  };




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


  async getDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await userService.fetchDoctors();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching doctors list error:', error);
      next(error)
    }
  }


  async getTopRatedDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await userService.fetchTopRatedDoctors();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching top rated doctors list error:', error);
      next(error)
    }
  }


  async getDocSpecializations(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {     
      const result = await userService.fetchDocSpecs();
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching doctor specializations list error:', error);
      next(error)
    }
  }
  
  
  async getSingleDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const email = req.query.email as string;
      const result = await userService.getSingleDoc(email);
      res.status(200).json(result)

    } catch (error: any) {
      console.error('fetching single doctor error:', error);
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
     
      const user = await userService.getUser(email)
      res.status(200).json({user});

    } catch (error: any) {
      console.error("Getting user profile error: ", error.message);
      next(error)
    }
  }


  async updateProfile(req:any, res: Response, next: NextFunction): Promise<void> {
    console.log('entered user updation');
    
     try {
       await userService.updateUser(req);
       res.status(200).json({ message: 'user details updated successfully.'});
 
     } catch (error: any) {
       console.error("Updating user error: ", error.message);
       next(error)
     }
   }


   async bookSlot(req:any, res: Response, next: NextFunction): Promise<void> {
    
     try {
       await userService.bookAppointment(req);
       res.status(200).json({ message: "user's slot booked successfully."});
 
     } catch (error: any) {
       console.error("user slot booking error: ", error.message);
       next(error)
     }
   }


   async checkSlot(req:any, res: Response, next: NextFunction): Promise<void> {
    
    try {
      const slotStatus = await userService.checkSlotAvailability(req);
      res.status(200).json({ slotStatus });

    } catch (error: any) {
      console.error("user slot booking error: ", error.message);
      next(error)
    }
  }



   async getUserAppointments(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {           
      const userId = req.user?.Id as string;
      const result = await userService.getAppointments(userId);
      res.status(200).json({result})

    } catch (error: any) {
      console.error('fetching user appointments error: ', error);
      next(error)
    }
  }


  async walletRecharge(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    try {

      await userService.rechargeWallet(req);
      res.status(200).json({ message: 'Wallet recharged successfully' });
      
    } catch (error: any) {
      console.error('user wallet recharge error:', error);
      next(error)
    }
  }


  async getUserWallet(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const wallet = await userService.getWallet(req);
      res.status(200).json({wallet})

    } catch (error: any) {
      console.error('fetching user wallet error:', error);
      next(error)
    }
  }


  async getUserWalletTransactions(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
      const result = await userService.getWalletTransactions(req);
      res.status(200).json({result})

    } catch (error: any) {
      console.error('fetching user wallet transactions error:', error);
      next(error)
    }
  }


  async cancelBooking(req:any, res: Response, next: NextFunction): Promise<void> {
    
    try {
      console.log("at controller");
      
      await userService.cancelAppointment(req);
      res.status(200).json({ message: "booking cancelled successfully."});

    } catch (error: any) {
      console.error("user cancel booking error: ", error.message);
      next(error)
    }
  }


  async addReview(req:any, res: Response, next: NextFunction): Promise<void> {
    
    try {
      await userService.addDoctorReview(req);
      res.status(200).json({ message: "review added successfully."});

    } catch (error: any) {
      console.error("user adding review error: ", error.message);
      next(error)
    }
  }


  async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {    
      const result = await userService.getDoctorReviews(req);
      res.status(200).json({result})

    } catch (error: any) {
      console.error('fetching doctor reviews: ', error);
      next(error)
    }
  }


  async viewPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  
    try {
        
      const result = await userService.getPrescription(req)
      res.status(200).json({result});

    } catch (error: any) {
      console.error("Getting user single prescription error: ", error.message);
      next(error)
    }
  }


  async getDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {     
     
      const data = await userService.fetchSingleDoctor(req);
      res.status(200).json({data})

    } catch (error: any) {
      console.error('fetching single doctor error:', error);
      next(error)
    }
  }


  
  async googleLogin(req:Request, res:Response, next:NextFunction): Promise<void> {
console.log("hit controller google");

    const { googleToken } = req.body;
    console.log(googleToken,"tokennnnnnnnnnnnnn");
    
    if(!googleToken){
     
      
      const error = new Error("The verifyIdToken method requires an ID Token")
      error.name = 'ValidationError'
      throw error;
    }

    try {
      const GoogleUser = await userService.googleLogin(googleToken, res);
      const token = generateUserTokens(res,GoogleUser._id as string);

      res.status(200).json({ 
        _id:GoogleUser._id,
        name: GoogleUser.name,
        email: GoogleUser.email,
        phone: GoogleUser.phone,
        isVerified: GoogleUser.isVerified,
        isBlocked: GoogleUser.isBlocked,
        token,
      });
    } catch(error:any){

      console.error('error logging in with google:',error.message);
      next(error)
    }
  };

}





export default new UserController();