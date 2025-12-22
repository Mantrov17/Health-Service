// // import {
// //   render,
// //   screen,
// //   fireEvent,
// //   waitFor,
// //   act,
// // } from "@testing-library/react";
// // import { MemoryRouter } from "react-router-dom";
// // import type { Doctor } from "../types";
// // import { useAppointments } from "../features/AppointmentList/lib/useAppointments";
// // import { DoctorListPage } from "../pages/DoctorListPage";
// // import { mockDoctors } from "../__mockData__/mockDoctors";

// // // Mock useAppointments hook
// // jest.mock("../../../features/AppointmentList/lib/useAppointments.ts", () => ({
// //   useAppointments: jest.fn(),
// // }));

// // // Mock child components
// // jest.mock("../../../entities/DoctorCard/ui/index.ts", () => ({
// //   DoctorCard: ({
// //     doctor,
// //     onBookAppointment,
// //   }: {
// //     doctor: Doctor;
// //     onBookAppointment: (doctor: Doctor) => void;
// //   }) => (
// //     <div data-testid={`doctor-card-${doctor.id}`}>
// //       <h3>{doctor.name}</h3>
// //       <button onClick={() => onBookAppointment(doctor)}>Записаться</button>
// //     </div>
// //   ),
// // }));

// // jest.mock("../../../features/AppointmentForm/ui/index.ts", () => ({
// //   AppointmentForm: ({
// //     doctor,
// //     onSubmit,
// //     onCancel,
// //   }: {
// //     doctor: Doctor;
// //     onSubmit: (values: any) => void;
// //     onCancel: () => void;
// //   }) => (
// //     <div data-testid="appointment-form">
// //       <h3>Запись к {doctor.name}</h3>
// //       <form
// //         onSubmit={(e) => {
// //           e.preventDefault();
// //           onSubmit({
// //             date: "2025-12-23",
// //             time: "10:00",
// //             patientName: "Тест Пациент",
// //             patientPhone: "+7 (999) 123-45-67",
// //           });
// //         }}
// //       >
// //         <input type="text" name="patientName" defaultValue="Тест Пациент" />
// //         <button type="submit">Подтвердить запись</button>
// //         <button type="button" onClick={onCancel}>
// //           Отмена
// //         </button>
// //       </form>
// //     </div>
// //   ),
// // }));

// // describe("DoctorListPage", () => {
// //   const mockCreateAppointment = jest.fn();

// //   beforeEach(() => {
// //     // Reset mocks before each test
// //     jest.clearAllMocks();

// //     // Setup mock implementation for useAppointments
// //     (useAppointments as jest.Mock).mockReturnValue({
// //       createAppointment: mockCreateAppointment,
// //     });
// //   });

// //   it("renders doctor list correctly", () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Check header elements
// //     expect(screen.getByText("Запись на прием к врачу")).toBeInTheDocument();
// //     expect(
// //       screen.getByText("Выберите специалиста и удобное время для записи")
// //     ).toBeInTheDocument();

// //     // Check that all mock doctors are rendered
// //     mockDoctors.forEach((doctor) => {
// //       expect(screen.getByText(doctor.name)).toBeInTheDocument();
// //       expect(
// //         screen.getByTestId(`doctor-card-${doctor.id}`)
// //       ).toBeInTheDocument();
// //     });

// //     // Check that appointment form is not shown initially
// //     expect(screen.queryByTestId("appointment-form")).not.toBeInTheDocument();
// //   });

// //   it("selects a doctor when booking button is clicked", async () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Click on the first doctor's booking button
// //     const firstDoctor = mockDoctors[0];
// //     const bookButton = screen.getByText("Записаться", { selector: `button` });

// //     await act(async () => {
// //       fireEvent.click(bookButton);
// //     });

// //     // Check that appointment form is now visible
// //     expect(screen.getByTestId("appointment-form")).toBeInTheDocument();
// //     expect(
// //       screen.getByText(`Запись к ${firstDoctor.name}`)
// //     ).toBeInTheDocument();
// //   });

// //   it("submits appointment form correctly", async () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Select a doctor first
// //     const firstDoctor = mockDoctors[0];
// //     const bookButton = screen.getByText("Записаться", { selector: `button` });

// //     await act(async () => {
// //       fireEvent.click(bookButton);
// //     });

// //     // Submit the appointment form
// //     const submitButton = screen.getByText("Подтвердить запись");

// //     await act(async () => {
// //       fireEvent.click(submitButton);
// //     });

// //     // Check that createAppointment was called with correct data
// //     await waitFor(() => {
// //       expect(mockCreateAppointment).toHaveBeenCalledWith({
// //         date: "2025-12-23",
// //         time: "10:00",
// //         patientName: "Тест Пациент",
// //         patientPhone: "+7 (999) 123-45-67",
// //         doctorId: firstDoctor.id,
// //       });
// //     });
// //   });

// //   it("cancels appointment form correctly", async () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Select a doctor
// //     const bookButton = screen.getByText("Записаться", { selector: `button` });

// //     await act(async () => {
// //       fireEvent.click(bookButton);
// //     });

// //     // Check form is visible
// //     expect(screen.getByTestId("appointment-form")).toBeInTheDocument();

// //     // Click cancel button
// //     const cancelButton = screen.getByText("Отмена");

// //     await act(async () => {
// //       fireEvent.click(cancelButton);
// //     });

// //     // Check form is hidden after cancellation
// //     expect(screen.queryByTestId("appointment-form")).not.toBeInTheDocument();
// //   });

// //   it("handles multiple doctor selections", async () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Select first doctor
// //     const firstBookButton = screen.getAllByText("Записаться")[0];

// //     await act(async () => {
// //       fireEvent.click(firstBookButton);
// //     });

// //     expect(
// //       screen.getByText(`Запись к ${mockDoctors[0].name}`)
// //     ).toBeInTheDocument();

// //     // Close the form
// //     const cancelButton = screen.getByText("Отмена");

// //     await act(async () => {
// //       fireEvent.click(cancelButton);
// //     });

// //     // Select second doctor
// //     const secondBookButton = screen.getAllByText("Записаться")[1];

// //     await act(async () => {
// //       fireEvent.click(secondBookButton);
// //     });

// //     expect(
// //       screen.getByText(`Запись к ${mockDoctors[1].name}`)
// //     ).toBeInTheDocument();
// //   });

// //   it("does not call createAppointment when form is not submitted", () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // No interactions - just check that createAppointment wasn't called
// //     expect(mockCreateAppointment).not.toHaveBeenCalled();
// //   });

// //   it("displays correct doctor information in form", async () => {
// //     render(
// //       <MemoryRouter>
// //         <DoctorListPage />
// //       </MemoryRouter>
// //     );

// //     // Select a specific doctor
// //     const cardiologist = mockDoctors.find(
// //       (d) => d.specialization === "Кардиолог"
// //     );
// //     if (!cardiologist) return; // Skip if no cardiologist found

// //     const cardiologistCard = screen
// //       .getByText(cardiologist.name)
// //       .closest("div[data-testid]");
// //     const bookButton = cardiologistCard?.querySelector("button");

// //     if (bookButton) {
// //       await act(async () => {
// //         fireEvent.click(bookButton);
// //       });

// //       // Check form displays correct doctor info
// //       expect(
// //         screen.getByText(`Запись к ${cardiologist.name}`)
// //       ).toBeInTheDocument();
// //       expect(screen.getByText(cardiologist.specialization)).toBeInTheDocument();
// //     }
// //   });
// // });

// // src/__tests__/DoctorListPage.test.tsx

// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
//   act,
// } from "@testing-library/react";
// import { useAppointments } from "../features/AppointmentList/lib/useAppointments";
// import { mockDoctors } from "../__mockData__/mockDoctors";
// import type { Doctor } from "../types";
// import { MemoryRouter } from "react-router-dom";
// import { DoctorListPage } from "../pages/DoctorListPage";

// // Mock useAppointments hook
// jest.mock("../features/AppointmentList/lib/useAppointments", () => ({
//   useAppointments: jest.fn(),
// }));

// // Mock child components
// jest.mock("../entities/DoctorCard/ui", () => ({
//   DoctorCard: ({
//     doctor,
//     onBookAppointment,
//   }: {
//     doctor: Doctor;
//     onBookAppointment: (doctor: Doctor) => void;
//   }) => (
//     <div data-testid={`doctor-card-${doctor.id}`}>
//       <h3>{doctor.name}</h3>
//       <button onClick={() => onBookAppointment(doctor)}>Записаться</button>
//     </div>
//   ),
// }));

// jest.mock("../features/AppointmentForm/ui", () => ({
//   AppointmentForm: ({
//     doctor,
//     onSubmit,
//     onCancel,
//   }: {
//     doctor: Doctor;
//     onSubmit: (values: any) => void;
//     onCancel: () => void;
//   }) => (
//     <div data-testid="appointment-form">
//       <h3>Запись к {doctor.name}</h3>
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           onSubmit({
//             date: "2025-12-23",
//             time: "10:00",
//             patientName: "Тест Пациент",
//             patientPhone: "+7 (999) 123-45-67",
//           });
//         }}
//       >
//         <input type="text" name="patientName" defaultValue="Тест Пациент" />
//         <button type="submit">Подтвердить запись</button>
//         <button type="button" onClick={onCancel}>
//           Отмена
//         </button>
//       </form>
//     </div>
//   ),
// }));

// describe("DoctorListPage", () => {
//   const mockCreateAppointment = jest.fn();

//   beforeEach(() => {
//     // Reset mocks before each test
//     jest.clearAllMocks();

//     // Setup mock implementation for useAppointments
//     (useAppointments as jest.Mock).mockReturnValue({
//       createAppointment: mockCreateAppointment,
//     });
//   });

//   it("renders doctor list correctly", () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Check header elements
//     expect(screen.getByText("Запись на прием к врачу")).toBeInTheDocument();
//     expect(
//       screen.getByText("Выберите специалиста и удобное время для записи")
//     ).toBeInTheDocument();

//     // Check that all mock doctors are rendered
//     mockDoctors.forEach((doctor) => {
//       expect(screen.getByText(doctor.name)).toBeInTheDocument();
//       expect(
//         screen.getByTestId(`doctor-card-${doctor.id}`)
//       ).toBeInTheDocument();
//     });

//     // Check that appointment form is not shown initially
//     expect(screen.queryByTestId("appointment-form")).not.toBeInTheDocument();
//   });

//   it("selects a doctor when booking button is clicked", async () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Click on the first doctor's booking button
//     const firstDoctor = mockDoctors[0];
//     const bookButton = screen.getByText("Записаться", { selector: `button` });

//     await act(async () => {
//       fireEvent.click(bookButton);
//     });

//     // Check that appointment form is now visible
//     expect(screen.getByTestId("appointment-form")).toBeInTheDocument();
//     expect(
//       screen.getByText(`Запись к ${firstDoctor.name}`)
//     ).toBeInTheDocument();
//   });

//   it("submits appointment form correctly", async () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Select a doctor first
//     const firstDoctor = mockDoctors[0];
//     const bookButton = screen.getByText("Записаться", { selector: `button` });

//     await act(async () => {
//       fireEvent.click(bookButton);
//     });

//     // Submit the appointment form
//     const submitButton = screen.getByText("Подтвердить запись");

//     await act(async () => {
//       fireEvent.click(submitButton);
//     });

//     // Check that createAppointment was called with correct data
//     await waitFor(() => {
//       expect(mockCreateAppointment).toHaveBeenCalledWith({
//         date: "2025-12-23",
//         time: "10:00",
//         patientName: "Тест Пациент",
//         patientPhone: "+7 (999) 123-45-67",
//         doctorId: firstDoctor.id,
//       });
//     });
//   });

//   it("cancels appointment form correctly", async () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Select a doctor
//     const bookButton = screen.getByText("Записаться", { selector: `button` });

//     await act(async () => {
//       fireEvent.click(bookButton);
//     });

//     // Check form is visible
//     expect(screen.getByTestId("appointment-form")).toBeInTheDocument();

//     // Click cancel button
//     const cancelButton = screen.getByText("Отмена");

//     await act(async () => {
//       fireEvent.click(cancelButton);
//     });

//     // Check form is hidden after cancellation
//     expect(screen.queryByTestId("appointment-form")).not.toBeInTheDocument();
//   });

//   it("handles multiple doctor selections", async () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Select first doctor
//     const firstBookButton = screen.getAllByText("Записаться")[0];

//     await act(async () => {
//       fireEvent.click(firstBookButton);
//     });

//     expect(
//       screen.getByText(`Запись к ${mockDoctors[0].name}`)
//     ).toBeInTheDocument();

//     // Close the form
//     const cancelButton = screen.getByText("Отмена");

//     await act(async () => {
//       fireEvent.click(cancelButton);
//     });

//     // Select second doctor
//     const secondBookButton = screen.getAllByText("Записаться")[1];

//     await act(async () => {
//       fireEvent.click(secondBookButton);
//     });

//     expect(
//       screen.getByText(`Запись к ${mockDoctors[1].name}`)
//     ).toBeInTheDocument();
//   });

//   it("does not call createAppointment when form is not submitted", () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // No interactions - just check that createAppointment wasn't called
//     expect(mockCreateAppointment).not.toHaveBeenCalled();
//   });

//   it("displays correct doctor information in form", async () => {
//     render(
//       <MemoryRouter>
//         <DoctorListPage />
//       </MemoryRouter>
//     );

//     // Select a specific doctor
//     const cardiologist = mockDoctors.find(
//       (d) => d.specialization === "Кардиолог"
//     );
//     if (!cardiologist) return; // Skip if no cardiologist found

//     const cardiologistNameElement = screen.getByText(cardiologist.name);
//     const cardiologistCard =
//       cardiologistNameElement.closest("div[data-testid]");
//     const bookButton = cardiologistCard?.querySelector("button");

//     if (bookButton) {
//       await act(async () => {
//         fireEvent.click(bookButton);
//       });

//       // Check form displays correct doctor info
//       expect(
//         screen.getByText(`Запись к ${cardiologist.name}`)
//       ).toBeInTheDocument();
//     }
//   });
// });
