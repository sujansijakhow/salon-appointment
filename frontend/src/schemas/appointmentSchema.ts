import * as yup from "yup";

export const appointmentSchema = yup.object({
  customer_name: yup
    .string()
    .trim()
    .required("Customer name is required."),
  customer_phone: yup
    .string()
    .trim()
    .required("Customer phone is required."),
  service: yup
    .number()
    .typeError("Please select a service.")
    .required("Please select a service."),
  date: yup
    .string()
    .required("Appointment date is required."),
  time: yup
    .string()
    .required("Appointment time is required."),
  notes: yup.string().trim().optional().default(""),
});

export type AppointmentFormValues = yup.InferType<typeof appointmentSchema>;