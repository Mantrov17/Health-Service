// Backend API types
export interface User {
  id: number;
  fullName: string;
  phone: string;
  email: string;
}

export interface Doctor {
  id: number;
  name: string;
  qualification: string;
  experience: number;
  rating: number;
  avatar: string | null;
}

export interface Slot {
  id: number;
  doctor_id: number;
  start_at: string; // ISO datetime
  end_at: string; // ISO datetime
  status: 'FREE' | 'BOOKED' | 'BLOCKED';
}

export interface Appointment {
  id: number;
  status: 'BOOKED' | 'CANCELLED';
  doctorName: string;
  qualification: string;
  slotId: number;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
}

// Auth types
export interface LoginRequest {
  login: string; // email or phone
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Appointment creation
export interface CreateAppointmentRequest {
  slotId: number;
  userId: number;
}
