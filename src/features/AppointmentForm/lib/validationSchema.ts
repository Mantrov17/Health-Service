import * as yup from "yup";

export const validationSchema = yup
  .object({
    date: yup.string().required("Выберите день приема"),
    time: yup.string().required("Выберите время приема"),
    patientName: yup
      .string()
      .required("Введите ваше имя")
      .min(2, "Имя должно содержать минимум 2 символа")
      .max(50, "Имя не должно превышать 50 символов")
      .matches(/^[A-Za-zА-Яа-яЁё\s]+$/, "Имя может содержать только буквы"),
    patientPhone: yup
      .string()
      .required("Введите ваш телефон")
      .matches(
        /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/,
        "Введите телефон в формате: +7 (999) 999-99-99",
      ),
    notes: yup
      .string()
      .max(500, "Примечания не должны превышать 500 символов")
      .default("")
      .transform((value) => value || ""),
  })
  .required();
