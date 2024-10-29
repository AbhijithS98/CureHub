import Doctor, { IDoctor } from "../models/doctor.js";

class DoctorRepository { 

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ email });
  }

  async findDoctorByEmailAndOtp(email: string, otp:number): Promise<IDoctor| null> {
    return await Doctor.findOne({ email, 'otp.code': otp });
  }

  async findDoctorByPwResetToken(token: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ pwResetToken:token, pwTokenExpiresAt: { $gt: new Date() } });
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


  async updateResettoken(email: string, token:string, expiry:Date): Promise<void> {
    await Doctor.updateOne(
      { email },
      { pwResetToken: token, pwTokenExpiresAt: expiry}
    )
  }


  async updatePassword(token: string, newPassword: string): Promise<void> {
    await Doctor.updateOne(
      { pwResetToken:token },
      { password: newPassword,
        pwResetToken: null,
        pwTokenExpiresAt: null,
      }
    )
  }

  async updateDoctorDetails(req:any): Promise<void> {
    const { 
      name, email, phone, 
      specialization, availability, 
      medicalLicenseNumber,gender,
      dob,experience,consultationFee,
      clinicName,district,city,bio, 
    } = req.body;

    await Doctor.updateOne(
      { email },
      { name,
        email,
        phone,
        specialization,
        availability,
        medicalLicenseNumber,
        gender,
        dob,
        experience,
        consultationFee,
        'address.clinicName': clinicName,
        'address.district': district,
        'address.city': city,
        bio
      }
    )
  }
}

export default new DoctorRepository();