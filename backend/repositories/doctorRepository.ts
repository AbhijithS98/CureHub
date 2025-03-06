import Doctor, { IDoctor } from "../models/doctorModel.js";
import User, { IUser} from "../models/userModel.js";
import Availability, { IAvailability } from "../models/availabilityModel.js";
import Appointment, { IAppointment } from "../models/appointmentModel.js";
import Wallet, { IWallet } from "../models/walletModel.js";
import { IDoctorRepository } from "./interfaces/IDoctorRepository.js";
import { BaseRepository } from "./baseRepository.js";



class DoctorRepository extends BaseRepository<IDoctor> implements IDoctorRepository {
  constructor() {
    super(Doctor);
  }

  async findDoctorByEmail(email: string): Promise<IDoctor | null> {
    return await this.findOne({ email });
  }

  async findDoctorById(_id: string): Promise<IDoctor | null> {
    return await this.findOne({ _id });
  }

  async findUserById(_id: string): Promise<IUser | null> {
    return await User.findOne({ _id });
  }

  async getAvailabilities(_id: string): Promise<IAvailability[] | null> {
    return await Availability.find({ doctor: _id });
  }

  async getAppointments(_id: string): Promise<IAppointment[] | null> {
    return await Appointment.find({ doctor: _id }).populate("user", "name");
  }

  async findDoctorByEmailAndOtp(email: string, otp: number): Promise<IDoctor | null> {
    return await this.findOne({ email, "otp.code": otp });
  }

  async findDoctorByPwResetToken(token: string): Promise<IDoctor | null> {
    return await this.findOne({ pwResetToken: token, pwTokenExpiresAt: { $gt: new Date() } });
  }

  async createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor> {
    return await this.create(doctorData);
  }

  async markVerifiedDoctor(email: string): Promise<number> {
    return await this.update({ email }, { isVerified: true, otp: { code: null, expiresAt: null } });
  }

  async updateOtp(email: string, newOtp: { code: number; expiresAt: Date }): Promise<number> {
    return await this.update({ email }, { otp: newOtp });
  }

  async updateResettoken(email: string, token: string, expiry: Date): Promise<number> {
    return await this.update({ email }, { pwResetToken: token, pwTokenExpiresAt: expiry });
  }

  async updatePassword(token: string, newPassword: string): Promise<number> {
    return await this.update({ pwResetToken: token }, { password: newPassword, pwResetToken: null, pwTokenExpiresAt: null });
  }

  async updateDoctorDetails(req: any): Promise<number> {
    const { name, email, phone, specialization, medicalLicenseNumber, gender, dob, experience, consultationFee, clinicName, district, city, bio } = req.body;

    return await this.update(
      { email },
      {
          name,
          email,
          phone,
          specialization,
          medicalLicenseNumber,
          gender,
          dob,
          experience,
          consultationFee,
          address: {
            clinicName,
            district,
            city,
          },
          bio,
        },
    );
  }

  async addSlots(email: string, newSlots: any): Promise<void> {
    await Availability.insertMany(newSlots);
  }

  async deleteSlot(slotId: string): Promise<void> {
    await Availability.deleteOne({ _id: slotId });
  }

  async deleteTimeSlot(slotId: string, timeSlotId: string): Promise<void> {
    await Availability.updateOne({ _id: slotId }, { $pull: { timeSlots: { _id: timeSlotId } } }, { new: true });
  }

  async findAppointment(appointmentId: string): Promise<IAppointment | null> {
    return await Appointment.findOne({ _id: appointmentId }).populate("payment");
  }

  async findUserWallet(userId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ ownerId: userId });
  }
}

export default new DoctorRepository();