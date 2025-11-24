import React from "react";
import type { Doctor } from "../../../types.ts";

import styles from "./styles.module.scss";

interface DoctorCardProps {
  doctor: Doctor;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onBookAppointment,
}) => {
  return (
    <div className={styles.card}>
      <img src={doctor.avatar} className={styles.avatar} />
      <div className={styles.info}>
        <h3>{doctor.name}</h3>
        <p className={styles.specialization}>{doctor.specialization}</p>
        <p>Опыт: {doctor.experience} лет</p>
        <p className={styles.rating}>Рейтинг: {doctor.rating} ★</p>
        <button
          onClick={() => onBookAppointment(doctor)}
          className={styles.bookButton}
        >
          Записаться на прием
        </button>
      </div>
    </div>
  );
};
