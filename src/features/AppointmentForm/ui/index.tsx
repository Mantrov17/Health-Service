import type { Doctor, Slot } from '../../../types.ts';
import styles from './styles.module.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface AppointmentFormProps {
  doctor: Doctor;
  slots: Slot[];
  isLoadingSlots: boolean;
  onSubmit: (slotId: number) => Promise<void>;
  onCancel: () => void;
}

export const AppointmentForm = ({
  doctor,
  slots,
  isLoadingSlots,
  onSubmit,
  onCancel,
}: AppointmentFormProps) => {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Group slots by date
  const slotsByDate = slots.reduce(
    (acc, slot) => {
      const date = new Date(slot.start_at).toLocaleDateString('ru-RU');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    },
    {} as Record<string, Slot[]>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit(selectedSlot);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании записи');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={styles.overlay}>
        <div className={`${styles.form} ${styles.successForm}`}>
          <h2 className={styles.successTitle}>Запись успешно создана</h2>
          <div className={styles.successIcon}>✓</div>

          <div className={styles.successActions}>
            <Link to="/appointments" onClick={onCancel} className={styles.appointmentsLink}>
              Перейти к моим записям
            </Link>
            <button type="button" onClick={onCancel} className={styles.successButton}>
              Закрыть
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>
          Запись к {doctor.name}
          <span className={styles.qualification}>{doctor.qualification}</span>
        </h2>

        {error && <div className={styles.error}>{error}</div>}

        {isLoadingSlots ? (
          <div className={styles.loading}>Загрузка доступного времени...</div>
        ) : slots.length === 0 ? (
          <div className={styles.noSlots}>У этого врача нет доступных слотов</div>
        ) : (
          <div className={styles.slotsContainer}>
            {Object.entries(slotsByDate).map(([date, dateSlots]) => (
              <div key={date} className={styles.dateGroup}>
                <h3 className={styles.dateTitle}>{date}</h3>
                <div className={styles.slotsGrid}>
                  {dateSlots.map((slot) => {
                    const startTime = new Date(slot.start_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });
                    const endTime = new Date(slot.end_at).toLocaleTimeString('ru-RU', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <label
                        key={slot.id}
                        className={`${styles.slotOption} ${
                          selectedSlot === slot.id ? styles.selected : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlot === slot.id}
                          onChange={() => setSelectedSlot(slot.id)}
                          className={styles.slotRadio}
                        />
                        <span className={styles.slotTime}>
                          {startTime} - {endTime}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

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
            disabled={isSubmitting || !selectedSlot || slots.length === 0}
          >
            {isSubmitting ? 'Идёт запись...' : 'Записаться'}
          </button>
        </div>
      </form>
    </div>
  );
};
