export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  avatar: string;
  workingHours: {
    [key: string]: string[];
  };
}

export interface Appointment {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes?: string;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes: string;
}
