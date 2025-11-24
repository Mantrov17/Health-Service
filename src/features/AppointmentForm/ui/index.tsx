import React from "react";
import type { AppointmentFormData, Doctor } from "../../../types.ts";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";

interface AppointmentFormProps {
  doctor: Doctor;
  onSubmit: (data: AppointmentFormData) => void;
  onCancel: () => void;
}

const formatPhoneNumber = (value: string): string => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 2) return `+7${phoneNumber}`;
  if (phoneNumberLength < 5) return `+7 (${phoneNumber.slice(1, 4)}`;
  if (phoneNumberLength < 8)
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}`;
  if (phoneNumberLength < 10)
    return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}`;

  return `+7 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(7, 9)}-${phoneNumber.slice(9, 11)}`;
};

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  doctor,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormData>();

  const selectedDate = watch("date");
  const availableDates = Object.keys(doctor.workingHours);
  const availableTime = selectedDate ? doctor.workingHours[selectedDate] : [];

  const onFormSubmit = (data: AppointmentFormData) => {
    onSubmit({ ...data });
  };

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
        <h2 className={styles.title}>Запись к {doctor.name}</h2>

        <div className={styles.field}>
          <Controller
            name="date"
            control={control}
            rules={{ required: "Выберите день приема" }}
            render={({ field }) => (
              <select
                {...field}
                className={`${styles.select} ${errors.date ? styles.error : ""}`}
              >
                <option value="">Выберите день</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.date && (
            <span className={styles.errorMessage}>{errors.date.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <Controller
            name="time"
            control={control}
            rules={{ required: "Выберите время приема" }}
            render={({ field }) => (
              <select
                {...field}
                className={`${styles.select} ${errors.time ? styles.error : ""}`}
              >
                <option value="">Выберите время</option>
                {availableTime.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.time && (
            <span className={styles.errorMessage}>{errors.time.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <Controller
            name="patientName"
            control={control}
            rules={{
              required: "Введите ваше имя",
              minLength: {
                value: 2,
                message: "Имя должно содержать минимум 2 символа",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Ваше имя"
                className={`${styles.input} ${errors.patientName ? styles.error : ""}`}
              />
            )}
          />
          {errors.patientName && (
            <span className={styles.errorMessage}>
              {errors.patientName.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <Controller
            name="patientPhone"
            control={control}
            rules={{
              required: "Введите ваш телефон",
              pattern: {
                value: /^[\+]?[0-9\s\-\(\)]+$/,
                message: "Введите корректный номер телефона",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                placeholder="+7 (999) 999-99-99"
                className={`${styles.input} ${errors.patientPhone ? styles.error : ""}`}
                onChange={(e) => {
                  const formattedValue = formatPhoneNumber(e.target.value);
                  field.onChange(formattedValue);
                }}
                value={field.value || ""}
              />
            )}
          />
          {errors.patientPhone && (
            <span className={styles.errorMessage}>
              {errors.patientPhone.message}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                placeholder="Дополнительные сведения"
                className={styles.textarea}
              />
            )}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Идёт запись" : "Записаться"}
          </button>
        </div>
      </form>
    </div>
  );
};
