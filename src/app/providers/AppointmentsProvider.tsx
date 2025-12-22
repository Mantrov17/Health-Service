import React, { type ReactNode, useState, useEffect } from 'react';
import {
  AppointmentsContext,
  type AppointmentsContextType,
} from '../../shared/lib/AppointmentsContext.tsx';
import type { Appointment } from '../../types.ts';
import { appointmentsApi } from '../../shared/api/api';
import { useAuth } from '../../shared/lib/AuthContext';

interface AppointmentsProviderProps {
  children: ReactNode;
}

export const AppointmentsProvider: React.FC<AppointmentsProviderProps> = ({
  children,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!isAuthenticated) {
      setAppointments([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await appointmentsApi.getMy();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [isAuthenticated]);

  const createAppointment = async (slotId: number) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    const newAppointment = await appointmentsApi.create({ slotId, userId: user.id });
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const cancelAppointment = async (id: number) => {
    await appointmentsApi.cancel(id);
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: 'CANCELLED' as const } : app))
    );
  };

  const value: AppointmentsContextType = {
    appointments,
    isLoading,
    createAppointment,
    cancelAppointment,
    refreshAppointments: fetchAppointments,
  };

  return (
    <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>
  );
};
