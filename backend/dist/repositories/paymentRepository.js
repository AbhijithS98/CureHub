var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseRepository } from "./baseRepository.js";
import Payment from "../models/paymentModel.js";
class PaymentRepository extends BaseRepository {
    constructor() {
        super(Payment);
    }
    createPayment(paymentData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(paymentData); // Using base method
        });
    }
    getUserWalletPayments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findAll({
                user: userId,
                $or: [{ transactionType: "Recharge" }, { method: "Wallet" }],
            }, {
                sort: { createdAt: -1 }
            });
        });
    }
    getRefundTransactionsCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.countDocuments({ transactionType: "Refund" });
        });
    }
    getRevenueChartData() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    getRevenueReports(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hittedddddddddddd");
            const filter = { transactionType: "Booking", status: "Completed" };
            if (startDate)
                filter.createdAt = { $gte: new Date(startDate) };
            if (endDate)
                filter.createdAt = Object.assign(Object.assign({}, (filter.createdAt || {})), { $lte: new Date(endDate) });
            return this.model.find(filter).populate("doctor", "consultationFee");
        });
    }
    getTotalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.aggregate([
                { $match: { transactionType: "Booking" } },
                { $group: { _id: null, total: { $sum: "$amount" } } },
            ]);
        });
    }
}
export default new PaymentRepository();
