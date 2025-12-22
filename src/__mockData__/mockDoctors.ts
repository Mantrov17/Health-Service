import type { Doctor } from "../types";

export const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "Доктор Иванов",
    qualification: "Кардиолог",
    experience: 10,
    rating: 4.8,
    avatar: "/public/ivanov.png",
  },
  {
    id: 2,
    name: "Доктор Петрова",
    qualification: "Невролог",
    experience: 8,
    rating: 4.9,
    avatar: "/public/Petrova.png",
  },
];
