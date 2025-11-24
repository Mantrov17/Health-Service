import type { Doctor } from "../types";

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    name: "Доктор Иванов",
    specialization: "Кардиолог",
    experience: 10,
    rating: 4.8,
    avatar: "/public/ivanov.png",
    workingHours: {
      Пн: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      Вт: ["10:00", "11:00", "12:00", "14:00"],
      Ср: ["09:00", "10:00", "13:00", "14:00"],
    },
  },
  {
    id: "2",
    name: "Доктор Петрова",
    specialization: "Невролог",
    experience: 8,
    rating: 4.9,
    avatar: "/public/Petrova.png",
    workingHours: {
      Пн: ["11:00", "12:00", "15:00", "16:00"],
      Чт: ["09:00", "10:00", "11:00", "14:00"],
      Пт: ["10:00", "11:00", "13:00", "14:00"],
    },
  },
];
