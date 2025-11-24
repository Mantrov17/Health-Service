import React from "react";
import { useAppointments } from "../../features/AppointmentList/lib/useAppointments.ts";
import styles from "./styles.module.scss";
import { AppointmentList } from "../../features/AppointmentList/ui";
import { mockDoctors } from "../../__mockData__/mockDoctors.ts";

export const AppointmentListPage: React.FC = () => {
  const { appointments, cancelAppointment } = useAppointments();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои записи</h1>
        <p className={styles.subtitle}>
          Здесь вы можете просмотреть и отменить свои записи
        </p>
      </div>

      <AppointmentList
        appointments={appointments}
        doctors={mockDoctors}
        onCancelAppointment={cancelAppointment}
      />
    </div>
  );
};
