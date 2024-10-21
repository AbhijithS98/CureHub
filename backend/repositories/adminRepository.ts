import Admin,{IAdmin} from "../models/admin.js";
import Doctor,{ IDoctor } from "../models/doctor.js";

class AdminRepository{
  
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async getAllDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: false});
  }
  
  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    console.log("Ar");
    return await Doctor.findOne({ email });
  }

  async approveDoc(email: string): Promise<void> {
    await Doctor.updateOne(
      { email }, 
      { isApproved: true });
  }

  async deleteDoctor(email: string): Promise<void> {
    await Doctor.deleteOne({ email });
  }
  
}

export default new AdminRepository();