import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { 
    getAppointments, 
    createAppointment, 
    updateAppointmentStatus, 
    deleteAppointment } from "../api/appointment";
    
import type { AppointmentInput, AppointmentStatus } from "../types";

const appointmentsKey = (status?: AppointmentStatus) =>
  ["appointments", status ?? "all"] as const;

export const useAppointments = (status?: AppointmentStatus) => {
  return useQuery({
    queryKey: appointmentsKey(status),
    queryFn: () => getAppointments(status),
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentInput) => createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AppointmentStatus }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};