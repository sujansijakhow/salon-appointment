import axiosInstance from "./axiosInstance";
import type { Service, ServiceInput } from "../types";

export const getServices = async (): Promise<Service[]> => {
  const response = await axiosInstance.get<Service[]>("/services");
  return response.data;
};

export const createService = async (data: ServiceInput): Promise<Service> => {
  const response = await axiosInstance.post<Service>("/services", data);
  return response.data;
};

export const updateService = async (
  id: number,
  data: ServiceInput
): Promise<Service> => {
  const response = await axiosInstance.put<Service>(`/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/services/${id}`);
};