import { BaseRepository } from "./baseRepository.js";
import Payment,{IPayment} from "../models/paymentModel.js";
import { IPaymentRepository } from "../interfaces/IPaymentRepository.js";


class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository{
  constructor() {
    super(Payment);
  }

  async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    return this.create(paymentData); // Using base method
  }

  async getUserWalletPayments(userId: string): Promise<IPayment[] | null> {
    return this.findAll(
    {
      user: userId,
      $or: [{ transactionType: "Recharge" }, { method: "Wallet" }],
    },
    {
      sort: { createdAt: -1 }
    }
  );
  }

  async getRefundTransactionsCount(): Promise<number> {
    return this.model.countDocuments({ transactionType: "Refund" });
  }

  async getRevenueChartData(): Promise<any[]> {
    return this.model.aggregate([
      { $match: { transactionType: "Booking" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  }

  async getRevenueReports(startDate?: string, endDate?: string): Promise<IPayment[]> {
    
    
    const filter: any = { transactionType: "Booking", status: "Completed" };

    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) filter.createdAt = { ...(filter.createdAt || {}), $lte: new Date(endDate) };

    return this.model.find(filter).populate("doctor", "consultationFee");
  }


  async getTotalRevenue(): Promise<{ _id: null; total: number }[] | []> {
    return this.model.aggregate([
      { $match: { transactionType: "Booking" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
  }
}

export default new PaymentRepository();
