import { BaseRepository } from "./baseRepository.js";
import Prescription,{IPrescription} from "../models/prescriptionModel.js";
import { IPrescriptionRepository } from "../interfaces/IPrescriptionRepository.js";

class PrescriptionRepository extends BaseRepository<IPrescription> implements IPrescriptionRepository {
  constructor() {
    super(Prescription);
  }

  async findPrescription(prescriptionId: string): Promise<IPrescription | null> {
    return this.model.findOne({ _id: prescriptionId })
      .populate("appointment", "date time")
      .populate("doctor", "name specialization address")
      .populate("patient", "name phone");
  }

  async createPrescription(prescriptionData: IPrescription): Promise<IPrescription> {
    return this.create(prescriptionData); // Using BaseRepository method
  }

  async updateUserPrescription(_id: string, updateFields: Partial<IPrescription>): Promise<void> {
    await this.update({ _id }, updateFields ); // Using BaseRepository method
  }
}

export default new PrescriptionRepository();