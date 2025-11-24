import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

export const HomePage: React.FC = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Медицинский центр "Здоровье"</h1>
        <p className={styles.heroSubtitle}>
          Ваше здоровье — наш главный приоритет
        </p>

        <div className={styles.ctaButtons}>
          <Link to="/doctors" className={styles.ctaButton}>
            Записаться на прием
          </Link>
          <Link to="/appointments" className={styles.ctaButtonSecondary}>
            Мои записи
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>👨‍⚕️</div>
          <h3>Квалифицированные врачи</h3>
          <p>Более 50 специалистов различных направлений</p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>🕒</div>
          <h3>Удобное время</h3>
          <p>Работаем с 8:00 до 20:00 без выходных</p>
        </div>

        <div className={styles.feature}>
          <div className={styles.featureIcon}>💻</div>
          <h3>Онлайн-запись</h3>
          <p>Записывайтесь на прием в любое время</p>
        </div>
      </section>
    </div>
  );
};
