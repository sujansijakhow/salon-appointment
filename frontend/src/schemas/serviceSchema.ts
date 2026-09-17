import * as yup from "yup";

export const serviceSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Service name is required."),
  price: yup
    .number()
    .typeError("Price must be a number.")
    .positive("Price must be a positive number.")
    .required("Price is required."),
  duration: yup
    .number()
    .typeError("Duration must be a number.")
    .integer("Duration must be a whole number of minutes.")
    .positive("Duration must be greater than zero.")
    .required("Duration is required."),
});

export type ServiceFormValues = yup.InferType<typeof serviceSchema>;