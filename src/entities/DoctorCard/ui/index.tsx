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
      {doctor.avatar && (
        <img src={doctor.avatar} className={styles.avatar} alt={doctor.name} />
      )}
      <div className={styles.info}>
        <h3 className={styles.name}>{doctor.name}</h3>
        <p className={styles.specialization}>{doctor.qualification}</p>
        <div className={styles.details}>
          <span>Опыт: {doctor.experience} лет</span>
          <span className={styles.rating}>★ {doctor.rating}</span>
        </div>
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
