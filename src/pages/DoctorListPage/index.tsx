import React, { useState } from "react";

import { useAppointments } from "../../features/AppointmentList/lib/useAppointments.ts";
import styles from "./styles.module.scss";
import type { AppointmentFormData, Doctor } from "../../types.ts";
import { mockDoctors } from "../../__mockData__/mockDoctors.ts";
import { DoctorCard } from "../../entities/DoctorCard/ui";
import { AppointmentForm } from "../../features/AppointmentForm/ui";

export const DoctorListPage: React.FC = () => {
  const { createAppointment } = useAppointments();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSubmitAppointment = (data: AppointmentFormData) => {
    createAppointment(data);
    setSelectedDoctor(null);
    alert("Запись успешно создана!");
  };

  return (
    <div className={styles.page}>
      <h1>Запись на прием к врачу</h1>
      <p>Выберите специалиста и удобное время для записи</p>

      <div className={styles.doctorsGrid}>
        {mockDoctors.map((doctor) => (
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
          onSubmit={handleSubmitAppointment}
          onCancel={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
};
