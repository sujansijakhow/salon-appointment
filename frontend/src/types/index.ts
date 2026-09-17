export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  created_at: string;
}

export type ServiceInput = Omit<Service, "id" | "created_at">;

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface Appointment {
  id: number;
  customer_name: string;
  customer_phone: string;
  service: number;
  service_name: string;
  service_price: number;
  date: string;
  time: string;
  notes: string;
  status: AppointmentStatus;
  created_at: string;
}

export type AppointmentInput = Omit<
  Appointment,
  "id" | "service_name" | "service_price" | "created_at" | "status"
> & {
  status?: AppointmentStatus;
};

export interface ApiErrorResponse {
  [field: string]: string[] | string;
}