import User,{ IUser} from "../models/user.js";
import Doctor,{ IDoctor } from "../models/doctor.js";
import Payment,{ IPayment } from "../models/paymentSchema.js";
import Appointment,{ IAppointment } from "../models/appointments.js";
import { BookedSlot } from "../types/bookedSlotsInterface.js";


class UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findUserById(_id: string): Promise<IUser | null> {
    return await User.findOne({ _id });
  }
 
  async findUserByPwResetToken(token: string): Promise<IUser | null> {
    return await User.findOne({ pwResetToken:token, pwTokenExpiresAt: { $gt: new Date() } });
  }

  async findUserByEmailAndOtp(email: string, otp:number): Promise<IUser | null> {
    return await User.findOne({ email, 'otp.code': otp });
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }
  
  async activateUser(email: string): Promise<void> {
    await User.updateOne(
      { email }, 
      { isVerified: true,'otp.code': null, 'otp.expiresAt': null });
  }
 
  async updateOtp(email: string, newOtp:{code:number,expiresAt:Date}): Promise<void> {
    await User.updateOne(
      { email },
      { otp: newOtp}
    )
  }

  async updateResettoken(email: string, token:string, expiry:Date): Promise<void> {
    await User.updateOne(
      { email },
      { pwResetToken: token, pwTokenExpiresAt: expiry}
    )
  }
  
  async updatePassword(token: string, newPassword: string): Promise<void> {
    await User.updateOne(
      { pwResetToken:token },
      { password: newPassword,
        pwResetToken: null,
        pwTokenExpiresAt: null,
      }
    )
  }

  async getAllDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: true });
  }


  async getAllSpecializations(): Promise<string[] | []> {
    return await Doctor.distinct("specialization");
  }
  
  async fetchSingleDoctor(email:string): Promise<IDoctor | null> {
    return await Doctor.findOne({email});
  }


  async updateUserDetails(req:any): Promise<void> {
    const { 
      name, email, phone, 
      dob, address
    } = req.body;

    await User.updateOne(
      { email },
      { name,
        email,
        phone,
        dob,
        address
      }
    )
  }

  async createPayment(paymentData: any): Promise<IPayment> {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  }



  async findAppointment(slotId:any, doctorId:any): Promise<IAppointment | null> {
    return await Appointment.findOne({ _id:slotId, doctor:doctorId });
  }


  async getUserAppointments(userId:any) : Promise<BookedSlot[] | null> {
    const pipeline = [
      {
        $match: {
          "timeSlots.user": userId, // Match appointments with time slots booked by the user
        },
      },
      {
        $unwind: "$timeSlots", // Unwind time slots array
      },
      {
        $match: {
          "timeSlots.user": userId, // Filter relevant time slots after unwinding
        },
      },
      {
        $lookup: {
          from: "doctors", // Name of the doctors collection
          localField: "doctor",
          foreignField: "_id",
          as: "doctorDetails", // Resulting doctor details
        },
      },
      {
        $unwind: "$doctorDetails", // Unwind doctor details array
      },
      {
        $project: {
          _id: 0, // Exclude appointment ID
          date: 1,
          time: "$timeSlots.time", // Include time slot time
          timeSlotId: "$timeSlots._id", // Include time slot ID
          status: "$timeSlots.status", // Include time slot status
          doctorName: { $concat: ["Dr. ", "$doctorDetails.name"] }, // Include doctor name
        },
      },
    ];

    const results:BookedSlot[] | null = await Appointment.aggregate(pipeline);
    console.log(results);
    return results
  }
}

export default new UserRepository();
