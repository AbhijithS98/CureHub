import { IPrescription } from "../../models/prescriptionModel.js";
import { Request } from "express";


export interface IPrescriptionService {
  getPrescription(req: Request): Promise<IPrescription | null>;
  updatePrescription(req: Request): Promise<void>;
}
