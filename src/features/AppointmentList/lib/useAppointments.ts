import { useContext } from "react";
import { AppointmentsContext } from "../../../shared/lib/AppointmentsContext.tsx";

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentsProvider",
    );
  }
  return context;
};
