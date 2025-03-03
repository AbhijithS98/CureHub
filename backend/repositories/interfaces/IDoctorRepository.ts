import { IDoctor } from "../../models/doctorModel.js";
import { IUser } from "../../models/userModel.js";
import { IAvailability } from "../../models/availabilityModel.js";
import { IAppointment } from "../../models/appointmentModel.js";
import { IWallet } from "../../models/walletModel.js";


export interface IDoctorRepository {
  findDoctorByEmail(email: string): Promise<IDoctor | null>;
  findDoctorById(_id: string): Promise<IDoctor | null>;
  findUserById(_id: string): Promise<IUser | null>;
  getAvailabilities(_id: string): Promise<IAvailability[] | null>;
  getAppointments(_id: string): Promise<IAppointment[] | null>;
  findDoctorByEmailAndOtp(email: string, otp: number): Promise<IDoctor | null>;
  findDoctorByPwResetToken(token: string): Promise<IDoctor | null>;
  createDoctor(doctorData: Partial<IDoctor>): Promise<IDoctor>;
  markVerifiedDoctor(email: string): Promise<void>;
  updateOtp(email: string, newOtp: { code: number; expiresAt: Date }): Promise<void>;
  updateResettoken(email: string, token: string, expiry: Date): Promise<void>;
  updatePassword(token: string, newPassword: string): Promise<void>;
  updateDoctorDetails(req: any): Promise<void>;
  addSlots(email: string, newSlots: any): Promise<void>;
  deleteSlot(slotId: string): Promise<void>;
  deleteTimeSlot(slotId: string, timeSlotId: string): Promise<void>;
  findAppointment(appointmentId: string): Promise<IAppointment | null>;
  findUserWallet(userId: string): Promise<IWallet | null>;
}
