import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import crypto from 'crypto';
import dotenv from 'dotenv';
import { IUser } from "../models/user.js";
import sendEmail from "../utils/emailSender.js";
import generateUserToken from "../utils/generateUserJwt.js";
import { Request, Response } from "express";

dotenv.config(); 

class UserService {
  
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<IUser> {

    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
        const error = Error("User already exists");
        error.name = 'ValidationError';  
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

    const newUserData = {
      ...userData,
      password: hashedPassword,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt
      },
      isVerified: false,
    };

    const user = await userRepository.createUser(newUserData);
    await sendEmail({
      to: user.email,
      subject: "OTP Verification",
      text: `Your OTP for registration is ${otpCode}`,
    });

    return user;
  }


  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const user = await userRepository.findUserByEmailAndOtp(email, Number(otp));

    if (!user || !user.otp || user.otp.expiresAt < new Date()) {
      return false;
    }
    return true;
  }


  async activateUser(email: string): Promise<void> {
    await userRepository.activateUser(email)
  }

  async updateOtp(email:string): Promise<void> {

    try {
      const otpCode = Math.floor(100000 + Math.random() * 900000);
      const otpExpiresAt = new Date(Date.now() + 3 * 60 * 1000);

      await userRepository.updateOtp(email,{code:otpCode,expiresAt:otpExpiresAt});
      await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP for registration is ${otpCode}`,
      });
      
    } catch (error: any) {
      console.error('Error updating OTP:', error.message || error);
      throw new Error(error.message ||'Failed to update OTP.');
    }
  }

  async authenticateUser(email: string, password: string, res: Response): Promise<IUser> {

    const User = await userRepository.findUserByEmail(email);
    if (!User) {
      const error = Error('User not found');
      error.name = 'ValidationError'
      throw error
    }

    const isPasswordMatch = await bcrypt.compare(password, User.password);
    if (!isPasswordMatch) {
      const error =  Error('Invalid credentials');
      error.name = 'ValidationError'
      throw error
    }

    if (!User.isVerified) {
      const error =  Error('Please verify your email before logging in.');
      error.name = 'ValidationError'
      throw error
    }

    if (User.isBlocked) {
      const error =  Error('Your account has been blocked. Please contact support.');
      error.name = 'ValidationError'
      throw error
    }

    generateUserToken(res,User._id as string)
    return User;
  }


  async clearCookie(req: Request, res: Response): Promise<void> {
   
    try {
      res.cookie('userJwt', '', {
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

      const user = await userRepository.findUserByEmail(email)
      if (!user) {
        const error =  Error('User not found');
        error.name = 'ValidationError'
        throw error;
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000)
      
      await userRepository.updateResettoken(user.email, resetToken, tokenExpiry)
      const resetLink = `${process.env.FRONTEND_URL}/user/reset-password?token=${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click the link below to reset your password:</p>
               <a href="${resetLink}">Reset Password</a>`
      });
  }


  async resetPass(token:string, password:string): Promise<void> {
   
      const user = await userRepository.findUserByPwResetToken(token);

      if(!user){
        const error = Error('Invalid or expired token');
        error.name = 'ValidationError';  
        throw error;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await userRepository.updatePassword(token,hashedPassword);
  }
}

export default new UserService();
