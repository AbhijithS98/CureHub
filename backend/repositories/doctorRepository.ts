import Doctor, { IDoctor } from "../models/doctor.js";

class DoctorRepository { 

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ email });
  }

  async findDoctorByEmailAndOtp(email: string, otp:number): Promise<IDoctor| null> {
    return await Doctor.findOne({ email, 'otp.code': otp });
  }

  async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
    const doctor = new Doctor(doctorData);
    return await doctor.save();
  }
  
  async markVerifiedDoctor(email: string): Promise<void> {
    await Doctor.updateOne(
      { email }, 
      { isVerified: true,'otp.code': null, 'otp.expiresAt': null });
  }
  
  async updateOtp(email: string, newOtp:{code:number,expiresAt:Date}): Promise<void> {
    await Doctor.updateOne(
      { email },
      { otp: newOtp}
    )
  }
}

export default new DoctorRepository();