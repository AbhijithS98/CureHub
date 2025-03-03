import { IPayment } from "../models/paymentModel";
import { IBaseRepository } from "./IBaseRepository";


export interface IPaymentRepository extends IBaseRepository<IPayment>{
  // Additional methods for Payment-specific queries
  createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
  getUserWalletPayments(userId: string): Promise<IPayment[] | null>;
  getRefundTransactionsCount(): Promise<number>;
  getRevenueChartData(): Promise<any[]>;
  getRevenueReports(startDate?: string, endDate?: string): Promise<IPayment[]>;
  getTotalRevenue(): Promise<{ _id: null; total: number }[] | []>;
}
