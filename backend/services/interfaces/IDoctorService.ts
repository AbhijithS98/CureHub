import { Request, Response } from "express";
import { IDoctor } from "../../models/doctorModel.js";
import { IAvailability } from "../../models/availabilityModel.js";
import { IAppointment } from "../../models/appointmentModel.js";
import { IPrescription } from "../../models/prescriptionModel.js";
import { IUser } from "../../models/userModel.js";

export interface IDoctorService {
  registerDoctor(req: Request): Promise<IDoctor>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  markVerifiedDoctor(email: string): Promise<void>;
  updateOtp(email: string): Promise<void>;
  authenticateDoctor(email: string, password: string, res: Response): Promise<IDoctor>;
  clearCookie(req: Request, res: Response): Promise<void>;
  sendResetLink(email: string): Promise<void>;
  resetPass(token: string, password: string): Promise<void>;
  getDoctor(email: string): Promise<IDoctor | null>;
  getAvailability(_id: string): Promise<IAvailability[] | null>;
  updateDoctor(req: Request): Promise<void>;
  updateSlots(req: Request): Promise<void>;
  removeSlot(req: Request): Promise<void>;
  removeTimeSlot(req: Request): Promise<void>;
  fetchAppointments(_id: string): Promise<IAppointment[] | null>;
  cancelBooking(req: Request): Promise<void>;
  addPatientPrescription(req: Request): Promise<void>;
  fetchUser(req: Request): Promise<IUser | null>;
}
