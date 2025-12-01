import type { Doctor } from "../../../types.ts";
import styles from "./styles.module.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "../lib/validationSchema.ts";
import { formatPhoneNumber } from "../../../shared/formatPhoneNumber.ts";
import type { AppointmentFormValues } from "../model/types.ts";
import { useState } from "react";
import { Link } from "react-router-dom";

export const AppointmentForm = ({
  doctor,
  onSubmit,
  onCancel,
}: {
  doctor: Doctor;
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const selectedDate = watch("date");
  const availableDates = Object.keys(doctor.workingHours);
  const availableTime = selectedDate ? doctor.workingHours[selectedDate] : [];

  const onFormSubmit = async (data: AppointmentFormValues) => {
    onSubmit({ ...data });
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className={styles.overlay}>
        <div className={`${styles.form} ${styles.successForm}`}>
          <h2 className={styles.successTitle}>Запись успешно создана</h2>
          <div className={styles.successIcon}>✓</div>

          <div className={styles.successActions}>
            <Link
              to="/appointments"
              onClick={onCancel}
              className={styles.appointmentsLink}
            >
              Перейти к моим записям
            </Link>
            <button
              type="button"
              onClick={onCancel}
              className={styles.successButton}
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit(onFormSubmit)}>
        <h2 className={styles.title}>Запись к {doctor.name}</h2>

        <div className={styles.field}>
          <Controller
            name="date"
            control={control}
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
