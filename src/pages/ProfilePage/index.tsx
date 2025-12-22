import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { useAuth } from "../../shared/lib/AuthContext";

export const ProfilePage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мой профиль</h1>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <h2 className={styles.name}>{user.fullName}</h2>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{user.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Телефон:</span>
            <span className={styles.value}>{user.phone}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editButton}>Редактировать профиль</button>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};
