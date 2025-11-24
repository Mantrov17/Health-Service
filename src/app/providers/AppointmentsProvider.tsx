import React, { type ReactNode, useState } from "react";
import {
  AppointmentsContext,
  type AppointmentsContextType,
} from "../../shared/lib/AppointmentsContext.tsx";
import type { Appointment, AppointmentFormData } from "../../types.ts";

interface AppointmentsProviderProps {
  children: ReactNode;
}

export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({
  children,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const createAppointment = (data: AppointmentFormData) => {
    const newAppointment: Appointment = {
      ...data,
      id: Date.now().toString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((app) => app.id !== id));
  };

  const value: AppointmentsContextType = {
    appointments,
    createAppointment,
    cancelAppointment,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
};
