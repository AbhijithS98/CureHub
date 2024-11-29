interface Imedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface IPrescription {
  _id: string;
  appointment: string;
  patient: string;
  doctor: string;
  diagnosis: string;
  medications: Imedication[];
  advice?: string;
}