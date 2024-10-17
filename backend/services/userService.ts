import userRepository from "../repositories/userRepository.js";
import bcrypt from "bcryptjs";
import { IUser } from "../models/user.js";
import sendEmail from "../utils/emailSender.js";

class UserService {
  
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<IUser> {
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newUserData = {
      ...userData,
      password: hashedPassword,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt,
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


  async verifyOtp({
    email,
    otp,
  }: {
    email: string;
    otp: string;
  }): Promise<boolean> {
    const user = await userRepository.findUserByEmailAndOtp(email, Number(otp));

    if (!user || !user.otp || user.otp.expiresAt < new Date()) {
      return false;
    }
    return true;
  }


  async activateUser(email: string): Promise<void> {
    await userRepository.activateUser(email)
  }
}

export default new UserService();
