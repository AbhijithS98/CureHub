var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PaymentController {
    constructor(paymentService) {
        if (!paymentService) {
            throw new Error("PaymentService is required");
        }
        this.paymentService = paymentService;
    }
    fetchRevenueStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Result = yield this.paymentService.getTotalRevenue();
                res.status(200).json({ Result });
            }
            catch (error) {
                console.error("Error fetching revenue stats:", error);
                next(error);
            }
        });
    }
    fetchRefundStats(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RefundStats = yield this.paymentService.getAllRefundTransactionsCount();
                res.status(200).json({ RefundStats });
            }
            catch (error) {
                console.error("Error fetching refund stats:", error);
                next(error);
            }
        });
    }
    fetchRevenueChartData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Result = yield this.paymentService.getRevenueTrends();
                res.status(200).json({ Result });
            }
            catch (error) {
                console.error("Error fetching revenue chart data:", error);
                next(error);
            }
        });
    }
    fetchRevenueReportData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const RevenueReports = yield this.paymentService.getRevenueReportData(req);
                const TotalRevenue = RevenueReports.reduce((acc, curr) => acc + curr.amount, 0);
                res.status(200).json({ TotalRevenue, RevenueReports });
            }
            catch (error) {
                console.error("Error fetching revenue report data:", error);
                next(error);
            }
        });
    }
}
export default PaymentController;
