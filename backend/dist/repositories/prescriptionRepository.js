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
import Prescription from "../models/prescriptionModel.js";
class PrescriptionRepository extends BaseRepository {
    constructor() {
        super(Prescription);
    }
    findPrescription(prescriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.model.findOne({ _id: prescriptionId })
                .populate("appointment", "date time")
                .populate("doctor", "name specialization address")
                .populate("patient", "name phone");
        });
    }
    createPrescription(prescriptionData) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(prescriptionData); // Using BaseRepository method
        });
    }
    updateUserPrescription(_id, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update({ _id }, updateFields); // Using BaseRepository method
        });
    }
}
export default new PrescriptionRepository();
