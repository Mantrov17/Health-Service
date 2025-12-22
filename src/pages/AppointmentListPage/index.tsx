import React from 'react';
import { useAppointments } from '../../features/AppointmentList/lib/useAppointments.ts';
import styles from './styles.module.scss';
import { AppointmentList } from '../../features/AppointmentList/ui';

export const AppointmentListPage: React.FC = () => {
  const { appointments, cancelAppointment, isLoading } = useAppointments();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои записи</h1>
        <p className={styles.subtitle}>Здесь вы можете просмотреть и отменить свои записи</p>
      </div>

      {isLoading ? (
        <div className={styles.loading}>Загрузка записей...</div>
      ) : (
        <AppointmentList appointments={appointments} onCancelAppointment={cancelAppointment} />
      )}
    </div>
  );
};
