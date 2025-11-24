import React from "react";
import type { Appointment, Doctor } from "../../../types.ts";
import styles from "./styles.module.scss";

interface AppointmentListProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onCancelAppointment: (id: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  doctors,
  onCancelAppointment,
}) => {
  const getDoctorById = (doctorId: string): Doctor | undefined => {
    return doctors.find((doctor) => doctor.id === doctorId);
  };

  if (appointments.length === 0) {
    return (
      <div className={styles.list}>
        <h2 className={styles.title}>Мои записи</h2>
        <p className={styles.emptyMessage}>У вас нет активных записей</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <h2 className={styles.title}>Мои записи ({appointments.length})</h2>

      <div className={styles.container}>
        {appointments.map((appointment) => {
          const doctor = getDoctorById(appointment.doctorId);

          return (
            <div key={appointment.id} className={styles.item}>
              <div className={styles.info}>
                <h3 className={styles.doctorName}>
                  Прием у {doctor?.name || "Неизвестный врач"}
                </h3>
                <div className={styles.details}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Специализация:</span>
                    <span>{doctor?.specialization || "Не указана"}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Дата:</span>
                    <span>{appointment.date}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Время:</span>
                    <span>{appointment.time}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Пациент:</span>
                    <span>{appointment.patientName}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Телефон:</span>
                    <span>{appointment.patientPhone}</span>
                  </div>
                  {appointment.notes && (
                    <div className={styles.detail}>
                      <span className={styles.label}>Примечания:</span>
                      <span>{appointment.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  onClick={() => onCancelAppointment(appointment.id)}
                  className={styles.cancelButton}
                >
                  Отменить запись
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
