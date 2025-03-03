import { IPrescription } from "../models/prescriptionModel.js";
import { IBaseRepository } from "./IBaseRepository.js";

export interface IPrescriptionRepository extends IBaseRepository<IPrescription> {
  findPrescription(prescriptionId: string): Promise<IPrescription | null>;
  createPrescription(prescriptionData: IPrescription): Promise<IPrescription>;
  updateUserPrescription(_id: string, updateFields: Partial<IPrescription>): Promise<void>;
}