import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";

export const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <Link
          to="/"
          className={`${styles.navLink} ${
            location.pathname === "/" ? styles.active : ""
          }`}
        >
          Главная
        </Link>
        <Link
          to="/doctors"
          className={`${styles.navLink} ${
            location.pathname === "/doctors" ? styles.active : ""
          }`}
        >
          Записаться
        </Link>
        <Link
          to="/appointments"
          className={`${styles.navLink} ${
            location.pathname === "/appointments" ? styles.active : ""
          }`}
        >
          Мои записи
        </Link>
      </div>

      <div className={styles.rightSection}>
        <Link to="/profile" className={styles.profileButton} title="Профиль">
          <span className={styles.profileIcon}>👤</span>
        </Link>
      </div>
    </nav>
  );
};
