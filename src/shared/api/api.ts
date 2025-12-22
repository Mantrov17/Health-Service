import { apiClient } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  Doctor,
  Slot,
  Appointment,
  CreateAppointmentRequest,
} from '../../types';

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/me');
    return response.data;
  },
};

// Doctors API
export const doctorsApi = {
  getAll: async (): Promise<Doctor[]> => {
    const response = await apiClient.get<Doctor[]>('/doctors');
    return response.data;
  },

  getSlots: async (doctorId: number): Promise<{ data: Slot[] }> => {
    const response = await apiClient.get<{ data: Slot[] }>(`/doctors/${doctorId}/slots`);
    return response.data;
  },
};

// Appointments API
export const appointmentsApi = {
  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    const response = await apiClient.post<Appointment>('/appointments', data);
    return response.data;
  },

  getMy: async (): Promise<Appointment[]> => {
    const response = await apiClient.get<Appointment[]>('/me/appointments');
    return response.data;
  },

  cancel: async (appointmentId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.post<{ success: boolean }>(
      `/appointments/${appointmentId}/cancel`
    );
    return response.data;
  },
};
