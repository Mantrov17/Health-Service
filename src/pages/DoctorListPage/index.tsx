import React, { useState, useEffect } from 'react';
import { useAppointments } from '../../features/AppointmentList/lib/useAppointments.ts';
import { useAuth } from '../../shared/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import type { Doctor, Slot } from '../../types.ts';
import { DoctorCard } from '../../entities/DoctorCard/ui';
import { AppointmentForm } from '../../features/AppointmentForm/ui';
import { doctorsApi } from '../../shared/api/api';

export const DoctorListPage: React.FC = () => {
  const { createAppointment } = useAppointments();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorsApi.getAll();
        setDoctors(data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async (doctor: Doctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedDoctor(doctor);
    setIsLoadingSlots(true);

    try {
      const response = await doctorsApi.getSlots(doctor.id);
      setSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
      setSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleSubmitAppointment = async (slotId: number) => {
    try {
      await createAppointment(slotId);
      setSelectedDoctor(null);
      setSlots([]);
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw error;
    }
  };

  if (isLoadingDoctors) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Загрузка врачей...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Запись на прием к врачу</h1>
        <p className={styles.subtitle}>Выберите специалиста и удобное время для записи</p>
      </div>

      <div className={styles.doctorsGrid}>
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onBookAppointment={handleBookAppointment}
          />
        ))}
      </div>

      {selectedDoctor && (
        <AppointmentForm
          doctor={selectedDoctor}
          slots={slots}
          isLoadingSlots={isLoadingSlots}
          onSubmit={handleSubmitAppointment}
          onCancel={() => {
            setSelectedDoctor(null);
            setSlots([]);
          }}
        />
      )}
    </div>
  );
};
