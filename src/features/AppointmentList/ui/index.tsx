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
        <h2>Мои записи</h2>
        <p>У вас нет активных записей</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <h2>Мои записи ({appointments.length})</h2>

      <div className={styles.container}>
        {appointments.map((appointment) => {
          const doctor = getDoctorById(appointment.doctorId);

          return (
            <div key={appointment.id} className={styles.item}>
              <div className={styles.info}>
                <h3>Прием у {doctor?.name || "Неизвестный врач"}</h3>
                <p>
                  <strong>Специализация:</strong>{" "}
                  {doctor?.specialization || "Не указана"}
                </p>
                <p>
                  <strong>Дата:</strong> {appointment.date}
                </p>
                <p>
                  <strong>Время:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Пациент:</strong> {appointment.patientName}
                </p>
                <p>
                  <strong>Телефон:</strong> {appointment.patientPhone}
                </p>
                {appointment.notes && (
                  <p>
                    <strong>Примечания:</strong> {appointment.notes}
                  </p>
                )}
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
