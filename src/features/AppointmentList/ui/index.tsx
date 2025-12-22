import React from 'react';
import type { Appointment } from '../../../types.ts';
import styles from './styles.module.scss';

interface AppointmentListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: number) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onCancelAppointment,
}) => {
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
          const startDate = new Date(appointment.startAt);
          const endDate = new Date(appointment.endAt);

          return (
            <div
              key={appointment.id}
              className={`${styles.item} ${
                appointment.status === 'CANCELLED' ? styles.cancelled : ''
              }`}
            >
              <div className={styles.info}>
                <h3 className={styles.doctorName}>Прием у {appointment.doctorName}</h3>
                <div className={styles.details}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Специализация:</span>
                    <span>{appointment.qualification}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Дата:</span>
                    <span>{startDate.toLocaleDateString('ru-RU')}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Время:</span>
                    <span>
                      {startDate.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {endDate.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Статус:</span>
                    <span
                      className={
                        appointment.status === 'CANCELLED' ? styles.statusCancelled : styles.statusBooked
                      }
                    >
                      {appointment.status === 'BOOKED' ? 'Забронировано' : 'Отменено'}
                    </span>
                  </div>
                </div>
              </div>

              {appointment.status === 'BOOKED' && (
                <div className={styles.actions}>
                  <button
                    onClick={() => onCancelAppointment(appointment.id)}
                    className={styles.cancelButton}
                  >
                    Отменить запись
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
