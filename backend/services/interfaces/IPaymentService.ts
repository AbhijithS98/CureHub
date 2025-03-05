import { IPayment } from "../../models/paymentModel.js";
import { Request } from "express";

export interface IPaymentService {
  createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
  getUserWalletPayments(userId: string): Promise<IPayment[] | null>;
  getRevenueChartData(): Promise<any[]>;
  getAllRefundTransactionsCount(): Promise<number | null>;
  getTotalRevenue(): Promise<{ _id: null; total: number }[] | []>;
  getRevenueTrends(): Promise<any[] | []>;
  getRevenueReportData(req: Request): Promise<IPayment[] | []>;
}
