import User,{ IUser} from "../models/user.js";
import Doctor,{ IDoctor } from "../models/doctor.js";
import Payment,{ IPayment } from "../models/paymentSchema.js";
import Availability,{ IAvailability } from "../models/availability.js";
import Appointment,{ IAppointment} from "../models/appointment.js";
import Wallet,{ IWallet } from "../models/walletSchema.js";
import Review,{ IReview} from "../models/reviewSchema.js";
import Prescription,{ IPrescription } from "../models/prescriptionSchema.js";
import { Types } from "mongoose";


class UserRepository {
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findDoctorById(_id: any): Promise<IDoctor | null> {
    return await Doctor.findOne({ _id });
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

  async getTopRatedDoctors(): Promise<IDoctor[] | null> {
    return await Doctor.find({ isApproved: true })
      .sort({ "ratingInfo.average": -1 }) 
      .limit(3); 
  }

  async getAllSpecializations(): Promise<string[] | []> {
    return await Doctor.distinct("specialization");
  }
  
  async fetchSingleDoctor(email:string): Promise<IDoctor | null> {
    return await Doctor.findOne({email});
  }


  async updateUserDetails(updatedData:any): Promise<void> {
    const { email } = updatedData;

    await User.updateOne(
      { email },
      { $set: updatedData }
    )
  }

  async createPayment(paymentData: any): Promise<IPayment> {
    const payment = new Payment(paymentData);
    await payment.save();
    return payment;
  }


  async createAppointment(appointmentDetails: Partial<IAppointment>): Promise<IAppointment> {
    const appointment = new Appointment(appointmentDetails);
    await appointment.save();
    return appointment;
  }

  async createUserWallet(walletObject: Partial<IWallet>): Promise<IWallet> {
    const wallet = new Wallet(walletObject);
    return await wallet.save();
  }

  async findAvailability(slotId:any): Promise<IAvailability | null> {
    return await Availability.findOne({ _id:slotId });
  }


  async findUserWallet(userId:any): Promise<IWallet | null> {
    return await Wallet.findOne({ ownerId: userId });
  }

  async getUserAppointments(id: string): Promise<IAppointment[] | null> {
    return await Appointment.find({ user: id })
    .populate('doctor', 'name profilePicture')
    .populate('user', 'name profilePicture')
    .sort({ createdAt: -1 });
  }
  

  async findAppointment(bookingId: string): Promise<IAppointment | null> {
    return await Appointment.findOne({ _id:bookingId }).populate('payment');
  }


  async updateTimeSlot(timeslotId: Types.ObjectId, updatedStatus: string): Promise<void> {
    await Availability.updateOne(
      { "timeSlots._id": timeslotId }, 
      { $set: { "timeSlots.$.status": updatedStatus } } 
    );
  }


  async getUserWalletPayments(id: string): Promise<IPayment[] | null> {
    return await Payment.find({
      user: id,
      $or: [
        { transactionType: "Recharge" },
        { method: "Wallet" }
      ]
    }).sort({ createdAt: -1 });
  }

  async createReview(newReview: Partial<IReview>): Promise<void> {
    const review = new Review(newReview);
    await review.save();
  }


  async getReviews(doctorId: any): Promise<IReview[] | null> {
    return await Review.find({ doctorId }).populate('patientId', 'name profilePicture')
  }

  async findPrescription(prescriptionId: any): Promise<IPrescription | null> {
    return await Prescription.findOne({ _id: prescriptionId })
    .populate('appointment', 'date time')
    .populate('doctor', 'name specialization address')
    .populate('patient', 'name phone')
    
  }


  async createGoogleUser(email:string,name:string): Promise<IUser> {
    const newUser = new User({
      email,
      name,
      phone: 'N/A',
      isVerified: true,
      password: 'google_oauth', 
    });
    
    return newUser.save();
  }
  

  
}

export default new UserRepository();
