interface Imedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface IPopulatedPatient {
  name: string;
  phone?: string; 
}

interface IPopulatedDoctor {
  name: string;
  specialization: string;
  address: {
    clinicName: string;
    district: string;
    city: string;
  };
}

interface IPopulatedAppointment {
  date: string;
  time: string; 
}

export interface IPrescription {
  _id: string;
  appointment: string | IPopulatedAppointment;
  patient: string | IPopulatedPatient;
  doctor: string | IPopulatedDoctor;
  diagnosis: string;
  medications: Imedication[];
  advice?: string;
}