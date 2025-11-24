import { createContext } from "react";
import type { Appointment, AppointmentFormData } from "../../types.ts";

export interface AppointmentsContextType {
  appointments: Appointment[];
  createAppointment: (data: AppointmentFormData) => void;
  cancelAppointment: (id: string) => void;
}

export const AppointmentsContext = createContext<
  AppointmentsContextType | undefined
>(undefined);
