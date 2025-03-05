import { Request, Response, NextFunction } from "express";
import { IPaymentService } from "../services/interfaces/IPaymentService.js";


class PaymentController {
  private paymentService: IPaymentService;

  constructor(paymentService: IPaymentService) {
    if (!paymentService) {
      throw new Error("PaymentService is required");
    }
    this.paymentService = paymentService;
  }

  async fetchRevenueStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const Result = await this.paymentService.getTotalRevenue();
      res.status(200).json({ Result });
    } catch (error: any) {
      console.error("Error fetching revenue stats:", error);
      next(error);
    }
  }

  async fetchRefundStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const RefundStats = await this.paymentService.getAllRefundTransactionsCount();
      res.status(200).json({ RefundStats });
    } catch (error: any) {
      console.error("Error fetching refund stats:", error);
      next(error);
    }
  }

  async fetchRevenueChartData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const Result = await this.paymentService.getRevenueTrends();
      res.status(200).json({ Result });
    } catch (error : any) {
      console.error("Error fetching revenue chart data:", error);
      next(error);
    }
  }

  async fetchRevenueReportData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {     
      const RevenueReports = await this.paymentService.getRevenueReportData(req);
      const TotalRevenue = RevenueReports.reduce((acc, curr) => acc + curr.amount, 0);
      res.status(200).json({ TotalRevenue, RevenueReports });
    } catch (error : any) {
      console.error("Error fetching revenue report data:", error);
      next(error);
    }
  }
}

export default PaymentController;
