import { createContext } from 'react';
import type { Appointment } from '../../types.ts';

export interface AppointmentsContextType {
  appointments: Appointment[];
  isLoading: boolean;
  createAppointment: (slotId: number) => Promise<void>;
  cancelAppointment: (id: number) => Promise<void>;
  refreshAppointments: () => Promise<void>;
}

export const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined
);
