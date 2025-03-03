import { IPayment } from "../models/paymentModel";

export interface IPaymentService {
  createPayment(paymentData: Partial<IPayment>): Promise<IPayment>;
  getUserWalletPayments(userId: string): Promise<IPayment[] | null>;
  getRefundTransactionsCount(): Promise<number>;
  getRevenueChartData(): Promise<any[]>;
  getRevenueReports(startDate?: string, endDate?: string): Promise<IPayment[]>;
}
