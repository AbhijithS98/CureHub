var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PrescriptionService {
    constructor(prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
    }
    getPrescription(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Pr_Id } = req.query;
            const PrescriptionId = Pr_Id.toString();
            const prescription = yield this.prescriptionRepository.findPrescription(PrescriptionId);
            if (!prescription) {
                const error = new Error('No prescription found with this id');
                error.name = 'ValidationError';
                throw error;
            }
            return prescription;
        });
    }
    updatePrescription(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updateFields = req.body;
            const prescription = yield this.prescriptionRepository.findPrescription(id);
            if (!prescription) {
                const error = new Error('No Prescription with this id');
                error.name = 'ValidationError';
                throw error;
            }
            yield this.prescriptionRepository.updateUserPrescription(id, updateFields);
        });
    }
}
export default PrescriptionService;
