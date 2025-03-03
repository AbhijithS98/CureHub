import { IPaymentRepository } from "../interfaces/IPaymentRepository";
import { IPaymentService } from "../interfaces/IPaymentService";
import { IPayment } from "../models/paymentModel";

class PaymentService implements IPaymentService {
  constructor(private paymentRepository: IPaymentRepository) {}

  async createPayment(paymentData: Partial<IPayment>): Promise<IPayment> {
    return this.paymentRepository.create(paymentData); // Uses BaseRepository method
  }

  async getUserWalletPayments(userId: string): Promise<IPayment[] | null> {
    return this.paymentRepository.getUserWalletPayments(userId);
  }

  async getRefundTransactionsCount(): Promise<number> {
    return this.paymentRepository.getRefundTransactionsCount();
  }

  async getRevenueChartData(): Promise<any[]> {
    return this.paymentRepository.getRevenueChartData();
  }

  async getRevenueReports(startDate?: string, endDate?: string): Promise<IPayment[]> {
    return this.paymentRepository.getRevenueReports(startDate, endDate);
  }
}

export default PaymentService;
