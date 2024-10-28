import Admin,{ IAdmin } from "../models/admin.js";
import Doctor,{ IDoctor } from "../models/doctor.js";
import User,{IUser} from "../models/user.js";


class AdminRepository{
  
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async getAllDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: false});
  }

  async getAllUsers(): Promise<IUser[] | null> {
    return await User.find({});
  }
  
  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ email });
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findAdminByPwResetToken(token: string): Promise<IAdmin | null> {
    return await Admin.findOne({ pwResetToken:token, pwTokenExpiresAt: { $gt: new Date() } });
  }

  async updateResettoken(email: string, token:string, expiry:Date): Promise<void> {
    await Admin.updateOne(
      { email },
      { pwResetToken: token, pwTokenExpiresAt: expiry}
    )
  }


  async updatePassword(token: string, newPassword: string): Promise<void> {
    await Admin.updateOne(
      { pwResetToken:token },
      { password: newPassword,
        pwResetToken: null,
        pwTokenExpiresAt: null,
      }
    )
  }

  async approveDoc(email: string): Promise<void> {
    await Doctor.updateOne(
      { email }, 
      { isApproved: true });
  }

  async deleteDoctor(email: string): Promise<void> {
    await Doctor.deleteOne({ email });
  }
  
  async blockUser(email: string): Promise<void> {
    await User.updateOne(
      { email }, 
      { isBlocked: true });
  }

  async unblockUser(email: string): Promise<void> {
    await User.updateOne(
      { email }, 
      { isBlocked: false });
  }
}

export default new AdminRepository();