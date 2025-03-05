var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PaymentService {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
        if (!paymentRepository) {
            throw new Error("PaymentRepository is required");
        }
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentRepository.create(paymentData); // Uses BaseRepository method
        });
    }
    getUserWalletPayments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentRepository.getUserWalletPayments(userId);
        });
    }
    getRevenueChartData() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.paymentRepository.getRevenueChartData();
        });
    }
    getAllRefundTransactionsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentRepository.getRefundTransactionsCount();
        });
    }
    getTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentRepository.getTotalRevenue();
        });
    }
    getRevenueTrends() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.paymentRepository.getRevenueChartData();
        });
    }
    getRevenueReportData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = typeof req.query.startDate === "string" ? req.query.startDate : undefined;
            const endDate = typeof req.query.endDate === "string" ? req.query.endDate : undefined;
            return yield this.paymentRepository.getRevenueReports(startDate, endDate);
        });
    }
}
export default PaymentService;
