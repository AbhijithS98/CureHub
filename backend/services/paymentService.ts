import { IPaymentRepository } from "../interfaces/IPaymentRepository.js";
import { IPaymentService } from "./interfaces/IPaymentService.js";
import { IPayment } from "../models/paymentModel.js";
import { Request } from "express";

class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository) {
    if (!paymentRepository) {
      throw new Error("PaymentRepository is required");
    }
  }

  async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    return this.paymentRepository.create(paymentData); // Uses BaseRepository method
  }

  async getUserWalletPayments(userId: string): Promise<IPayment[] | null> {
    return this.paymentRepository.getUserWalletPayments(userId);
  }

  async getRevenueChartData(): Promise<any[]> {
    return this.paymentRepository.getRevenueChartData();
  }

  async getAllRefundTransactionsCount(): Promise<number | null> {
    return await this.paymentRepository.getRefundTransactionsCount();
  }

  async getTotalRevenue(): Promise<{ _id: null; total: number }[] | []> {
    return await this.paymentRepository.getTotalRevenue();
  }

  async getRevenueTrends(): Promise<any[] | []> {
    return await this.paymentRepository.getRevenueChartData();
  }

  async getRevenueReportData(req: Request): Promise<IPayment[] | []> {
    const startDate = typeof req.query.startDate === "string" ? req.query.startDate : undefined;
    const endDate = typeof req.query.endDate === "string" ? req.query.endDate : undefined;

    return await this.paymentRepository.getRevenueReports(startDate, endDate);
  }
}

export default PaymentService;
