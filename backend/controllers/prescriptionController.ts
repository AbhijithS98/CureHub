import { Request, Response, NextFunction } from "express";
import { IPrescriptionService } from "../services/interfaces/IPrescriptionService.js";

class PrescriptionController {
  private prescriptionService: IPrescriptionService;

  constructor(prescriptionService: IPrescriptionService) {
    if (!prescriptionService) {
      throw new Error("PrescriptionService is required");
    }
    this.prescriptionService = prescriptionService;
  }

  async viewPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.prescriptionService.getPrescription(req);
      res.status(200).json({ result });
    } catch (error: any) {
      console.error("Getting single prescription error: ", error.message);
      next(error);
    }
  }

  async updatePrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.prescriptionService.updatePrescription(req);
      res.status(200).json({ message: "Prescription updated successfully." });
    } catch (error: any) {
      console.error("Updating prescription error: ", error.message);
      next(error);
    }
  }
}

export default PrescriptionController;
