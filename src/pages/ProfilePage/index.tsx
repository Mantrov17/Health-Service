import React from "react";
import styles from "./styles.module.scss";
import { mockProfileInfo } from "../../__mockData__/mockProfileInfo.ts";

export const ProfilePage: React.FC = () => {
  return (
    <div className={styles.page}>
      <h1>Мой профиль</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{mockProfileInfo.avatar}</div>
          <h2>{mockProfileInfo.name}</h2>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{mockProfileInfo.email}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Телефон:</span>
            <span className={styles.value}>{mockProfileInfo.phone}</span>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.label}>Дата рождения:</span>
            <span className={styles.value}>{mockProfileInfo.birthDate}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.editButton}>Редактировать профиль</button>
          <button className={styles.logoutButton}>Выйти</button>
        </div>
      </div>
    </div>
  );
};
