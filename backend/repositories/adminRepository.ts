import { Request, Response } from "express";
import Admin, { IAdmin } from "../models/adminModel.js";
import Appointment, { IAppointment } from "../models/appointmentModel.js";
import Doctor, { IDoctor } from "../models/doctorModel.js";
// import Payment, { IPayment } from "../models/paymentModel.js";
import User, { IUser } from "../models/userModel.js";
import { BaseRepository } from "./baseRepository.js";

class AdminRepository {
  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await Admin.findOne({ email });
  }

  async getAllDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: true });
  }

  async getAllUnapprovedDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: false });
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
    return await Admin.findOne({
      pwResetToken: token,
      pwTokenExpiresAt: { $gt: new Date() },
    });
  }

  async updateResettoken(
    email: string,
    token: string,
    expiry: Date
  ): Promise<void> {
    await Admin.updateOne(
      { email },
      { pwResetToken: token, pwTokenExpiresAt: expiry }
    );
  }

  async updatePassword(token: string, newPassword: string): Promise<void> {
    await Admin.updateOne(
      { pwResetToken: token },
      { password: newPassword, pwResetToken: null, pwTokenExpiresAt: null }
    );
  }

  async approveDoc(email: string): Promise<void> {
    await Doctor.updateOne({ email }, { isApproved: true });
  }

  async deleteDoctor(email: string): Promise<void> {
    await Doctor.deleteOne({ email });
  }

  async blockUser(email: string): Promise<void> {
    await User.updateOne({ email }, { isBlocked: true });
  }

  async unblockUser(email: string): Promise<void> {
    await User.updateOne({ email }, { isBlocked: false });
  }

  async blockDoctor(email: string): Promise<void> {
    await Doctor.updateOne({ email }, { isBlocked: true });
  }

  async unblockDoctor(email: string): Promise<void> {
    await Doctor.updateOne({ email }, { isBlocked: false });
  }

  async getAllAppointments(): Promise<IAppointment[] | null> {
    return await Appointment.find()
      .populate("doctor", "name")
      .populate("user", "name")
      .exec();
  }

  async getAllUsersCount(): Promise<number | null> {
    return await User.countDocuments({});
  }

  async getAllDoctorsCount(): Promise<number | null> {
    return await Doctor.countDocuments({ isApproved: true });
  }

  async getActiveAppointmentsCount(): Promise<number | null> {
    return await Appointment.countDocuments({ status: "Booked" });
  }

  async getCompletedAppointmentsCount(): Promise<number | null> {
    return await Appointment.countDocuments({ status: "Completed" });
  }

  async getCancelledAppointmentsCount(): Promise<number | null> {
    return await Appointment.countDocuments({ status: "Cancelled" });
  }

  // async getRefundTransactionsCount(): Promise<number | null> {
  //   return await Payment.countDocuments({ transactionType: "Refund" });
  // }

  // async getTotalRevenue(): Promise<{ _id: null; total: number }[] | []> {
  //   const totalRevenue = await Payment.aggregate([
  //     { $match: { transactionType: "Booking" } },
  //     { $group: { _id: null, total: { $sum: "$amount" } } },
  //   ]);

  //   return totalRevenue;
  // }

  async getAppointmentsChartData(): Promise<any[] | []> {
    const appointmentTrend = await Appointment.aggregate([
      {
        $match: {
          status: { $in: ["Booked", "Completed"] },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$date" }, year: { $year: "$date" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);
    return appointmentTrend;
  }

  // async getRevenueChartData(): Promise<any[] | []> {
  //   const RevenueTrend = await Payment.aggregate([
  //     {
  //       $match: {
  //         transactionType: "Booking",
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: {
  //           month: { $month: "$createdAt" },
  //           year: { $year: "$createdAt" },
  //         },
  //         total: { $sum: "$amount" },
  //       },
  //     },
  //     {
  //       $sort: { "_id.year": 1, "_id.month": 1 },
  //     },
  //   ]);
  //   return RevenueTrend;
  // }

  async getAppointmentReports(req: Request): Promise<IAppointment[] | []> {
    const { startDate, endDate, doctorId, patientId } = req.query;

    // Build the filter object
    const start =
      startDate && typeof startDate === "string" ? new Date(startDate) : null;
    const end =
      endDate && typeof endDate === "string" ? new Date(endDate) : null;

    let filter: any = {};

    if (start && end) {
      filter.date = { $gte: start, $lte: end };
    } else if (start) {
      filter.date = { $gte: start };
    } else if (end) {
      filter.date = { $lte: end };
    }

    if (doctorId) {
      filter.doctor = doctorId;
    }
    if (patientId) {
      filter.user = patientId;
    }

    const appointmentReports = await Appointment.find(filter)
      .populate("doctor", "name")
      .populate("user", "name")
      .exec();
    return appointmentReports;
  }

  // async getRevenueReports(req: Request): Promise<IPayment[] | []> {
  //   const { startDate, endDate } = req.query;

  //   // Build the filter object
  //   const start =
  //     startDate && typeof startDate === "string" ? new Date(startDate) : null;
  //   const end =
  //     endDate && typeof endDate === "string" ? new Date(endDate) : null;

  //   let filter: any = {
  //     transactionType: "Booking",
  //     status: "Completed",
  //   };

  //   if (start && end) {
  //     filter.createdAt = { $gte: start, $lte: end };
  //   } else if (start) {
  //     filter.createdAt = { $gte: start };
  //   } else if (end) {
  //     filter.createdAt = { $lte: end };
  //   }

  //   const revenueReports = await Payment.find(filter).populate(
  //     "doctor",
  //     "consultationFee"
  //   );
  //   return revenueReports;
  // }
}

export default new AdminRepository();
