var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PrescriptionController {
    constructor(prescriptionService) {
        if (!prescriptionService) {
            throw new Error("PrescriptionService is required");
        }
        this.prescriptionService = prescriptionService;
    }
    viewPrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.prescriptionService.getPrescription(req);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error("Getting single prescription error: ", error.message);
                next(error);
            }
        });
    }
    updatePrescription(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prescriptionService.updatePrescription(req);
                res.status(200).json({ message: "Prescription updated successfully." });
            }
            catch (error) {
                console.error("Updating prescription error: ", error.message);
                next(error);
            }
        });
    }
}
export default PrescriptionController;
