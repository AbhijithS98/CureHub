import Doctor, { IDoctor } from "../models/doctor.js";
import User, { IUser} from "../models/user.js";
import Availability, { IAvailability } from "../models/availability.js";
import Appointment, { IAppointment } from "../models/appointment.js";
import Wallet, { IWallet } from "../models/walletSchema.js";
import Payment, { IPayment} from "../models/paymentSchema.js";
import Prescription, { IPrescription } from "../models/prescriptionSchema.js";

class DoctorRepository { 

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await Doctor.findOne({ email });
  }

  async findDoctorById(_id: any): Promise<IDoctor | null> {
    return await Doctor.findOne({ _id });
  }

  async findUserById(_id: any): Promise<IUser | null> {
    return await User.findOne({ _id });
  }

  async getAvailabilities(_id: string): Promise<IAvailability[] | null> {
    return await Availability.find({ doctor: _id });
  }

  async getAppointments(_id: string): Promise<IAppointment[] | null> {
    return await Appointment.find({ doctor: _id }).populate('user', 'name');;
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
      specialization, 
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
  
  async addSlots(email: string, newSlots: any): Promise<void> {
    await Availability.insertMany(newSlots);
  }


  async deleteSlot(slotId: string): Promise<void> {
    await Availability.deleteOne({ _id: slotId });
  }
  

  async deleteTimeSlot(slotId: string, timeSlotId: string): Promise<void> {
    await Availability.updateOne(
      { _id: slotId },
      { $pull: { timeSlots: { _id: timeSlotId } } },
      { new: true }
    );
  }

  async findAppointment(appointmentId: string): Promise<IAppointment | null> {
    return await Appointment.findOne({ _id: appointmentId }).populate('payment');
  }

  async findUserWallet(userId:any): Promise<IWallet | null> {
    return await Wallet.findOne({ ownerId: userId });
  }


  async createPayment(paymentData: any): Promise<IPayment> {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  }

  async createPrescription(prescriptionData: IPrescription): Promise<IPrescription> {
    const prescription = new Prescription(prescriptionData);
    await prescription.save();
    return prescription;
  }

  async findPrescription(prescriptionId: any): Promise<IPrescription | null> {
    return await Prescription.findOne({ _id: prescriptionId })
    .populate('appointment', 'date time')
    .populate('doctor', 'name specialization address')
    .populate('patient', 'name phone')
    
  }

  async updateUserPrescription(_id:any, updateFields:Partial<IPrescription>): Promise<void> {
    await Prescription.findByIdAndUpdate(
      _id, 
      { $set: updateFields }
    );
  }
} 

export default new DoctorRepository();