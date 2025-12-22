import React, { useState } from 'react';
import { useAuth } from '../../shared/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { formatPhoneNumber } from '../../shared/formatPhoneNumber';
import styles from './styles.module.scss';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Регистрация</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <input
              type="text"
              placeholder="Полное имя"
              className={styles.input}
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="tel"
              placeholder="+7 (999) 999-99-99"
              className={styles.input}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })
              }
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="email"
              placeholder="Email"
              className={styles.input}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              placeholder="Пароль (минимум 8 символов)"
              className={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              minLength={8}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <div className={styles.footer}>
            <Link to="/login" className={styles.link}>
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
