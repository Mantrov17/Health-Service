import React, { useState } from 'react';
import { useAuth } from '../../shared/lib/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ login: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Вход</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.field}>
            <input
              type="text"
              placeholder="Email или телефон"
              className={styles.input}
              value={formData.login}
              onChange={(e) => setFormData({ ...formData, login: e.target.value })}
              required
            />
          </div>

          <div className={styles.field}>
            <input
              type="password"
              placeholder="Пароль"
              className={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <div className={styles.footer}>
            <Link to="/register" className={styles.link}>
              Нет аккаунта? Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
