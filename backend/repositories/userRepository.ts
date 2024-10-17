import User, { IUser } from "../models/user.js";

class UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
 
  async findUserByEmailAndOtp(email: string, otp:number): Promise<IUser | null> {
    return await User.findOne({ email, 'otp.code': otp });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  
  async activateUser(email: string): Promise<void> {
    await User.updateOne(
      { email }, 
      { isVerified: true,'otp.code': null, 'otp.expiresAt': null });
  }

}

export default new UserRepository();
