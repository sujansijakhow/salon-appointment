import axiosInstance from "./axiosInstance";
import type { Appointment, AppointmentInput, AppointmentStatus } from "../types";

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date?: string;
  search?: string;
}

export const getAppointments = async (
  filters: AppointmentFilters = {}
): Promise<Appointment[]> => {
  const response = await axiosInstance.get<Appointment[]>("/appointments", {
    params: filters,
  });
  return response.data;
};

export const createAppointment = async (
  data: AppointmentInput
): Promise<Appointment> => {
  const response = await axiosInstance.post<Appointment>("/appointments", data);
  return response.data;
};

export const updateAppointmentStatus = async (
  id: number,
  status: AppointmentStatus
): Promise<Appointment> => {
  const response = await axiosInstance.patch<Appointment>(
    `/appointments/${id}/status`,
    { status }
  );
  return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/appointments/${id}`);
};