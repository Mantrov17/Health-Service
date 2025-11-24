import React, { useState } from "react";
import type { Doctor, AppointmentFormData } from "../../../types.ts";
import styles from "./styles.module.scss";

interface AppointmentFormProps {
  doctor: Doctor;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  doctor,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<
    Omit<AppointmentFormData, "doctorId">
  >({
    date: "",
    time: "",
    patientName: "",
    patientPhone: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      doctorId: doctor.id,
    });
  };

  const availableDates = Object.keys(doctor.workingHours);

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Запись к {doctor.name}</h2>

        <select
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value, time: "" })
          }
          required
        >
          <option value="">Выберите день</option>
          {availableDates.map((date) => (
            <option key={date} value={date}>
              {date}
            </option>
          ))}
        </select>

        <select
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
          disabled={!formData.date}
        >
          <option value="">Выберите время</option>
          {formData.date &&
            doctor.workingHours[formData.date]?.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>

        <input
          type="text"
          placeholder="Ваше имя"
          value={formData.patientName}
          onChange={(e) =>
            setFormData({ ...formData, patientName: e.target.value })
          }
          required
        />

        <input
          type="tel"
          placeholder="Ваш телефон"
          value={formData.patientPhone}
          onChange={(e) =>
            setFormData({ ...formData, patientPhone: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Дополнительные пожелания"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <div className={styles.actions}>
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit">Записаться</button>
        </div>
      </form>
    </div>
  );
};
