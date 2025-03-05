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
  markVerifiedDoctor(email: string): Promise<number>;
  updateOtp(email: string, newOtp: { code: number; expiresAt: Date }): Promise<number>;
  updateResettoken(email: string, token: string, expiry: Date): Promise<number>;
  updatePassword(token: string, newPassword: string): Promise<number>;
  updateDoctorDetails(req: any): Promise<number>;
  addSlots(email: string, newSlots: any): Promise<void>;
  deleteSlot(slotId: string): Promise<void>;
  deleteTimeSlot(slotId: string, timeSlotId: string): Promise<void>;
  findAppointment(appointmentId: string): Promise<IAppointment | null>;
  findUserWallet(userId: string): Promise<IWallet | null>;
}
