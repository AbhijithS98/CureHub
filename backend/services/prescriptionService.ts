import { IPrescriptionService } from './interfaces/IPrescriptionService.js';
import { IPrescriptionRepository } from '../interfaces/IPrescriptionRepository.js';
import { IPrescription } from '../models/prescriptionModel.js';
import { Request } from 'express';

class PrescriptionService implements IPrescriptionService {
  constructor(private prescriptionRepository: IPrescriptionRepository) {}

  async getPrescription(req: Request): Promise<IPrescription | null> {
    const { Pr_Id } = req.query;
    const PrescriptionId = Pr_Id!.toString();
    const prescription = await this.prescriptionRepository.findPrescription(PrescriptionId);

    if (!prescription) {
      const error = new Error('No prescription found with this id');
      error.name = 'ValidationError';
      throw error;
    }

    return prescription;
  }

  async updatePrescription(req: Request): Promise<void> {
    const { id } = req.params;
    const updateFields = req.body;
    const prescription = await this.prescriptionRepository.findPrescription(id);

    if (!prescription) {
      const error = new Error('No Prescription with this id');
      error.name = 'ValidationError';
      throw error;
    }

    await this.prescriptionRepository.updateUserPrescription(id, updateFields);
  }
}


export default PrescriptionService;
