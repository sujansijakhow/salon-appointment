import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  appointmentSchema,
  type AppointmentFormValues,
} from "../../schemas/appointmentSchema";
import type { Service } from "../../types";

interface AppointmentFormProps {
  services: Service[];
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitError?: string;
}

const AppointmentForm = ({
  services,
  onSubmit,
  onCancel,
  isSubmitting,
  submitError,
}: AppointmentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      customer_name: "",
      customer_phone: "",
      date: "",
      time: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div>
        <label htmlFor="customer_name" className="mb-1 block text-sm font-medium text-gray-700">
          Customer name
        </label>
        <input
          id="customer_name"
          type="text"
          className="form-input"
          {...register("customer_name")}
        />
        {errors.customer_name && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.customer_name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="customer_phone" className="mb-1 block text-sm font-medium text-gray-700">
          Customer phone
        </label>
        <input
          id="customer_phone"
          type="tel"
          className="form-input"
          {...register("customer_phone")}
        />
        {errors.customer_phone && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.customer_phone.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="service" className="mb-1 block text-sm font-medium text-gray-700">
          Service
        </label>
        <select id="service" className="form-input" {...register("service")}>
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name} - NPR {service.price} ({service.duration} min)
            </option>
          ))}
        </select>
        {errors.service && (
          <p role="alert" className="mt-1 text-sm text-red-600">
            {errors.service.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="mb-1 block text-sm font-medium text-gray-700">
            Date
          </label>
          <input id="date" type="date" className="form-input" {...register("date")} />
          {errors.date && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.date.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="time" className="mb-1 block text-sm font-medium text-gray-700">
            Time
          </label>
          <input id="time" type="time" className="form-input" {...register("time")} />
          {errors.time && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.time.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
          Notes <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <textarea id="notes" rows={3} className="form-input" {...register("notes")} />
      </div>

      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button"
        >
          {isSubmitting ? "Booking..." : "Book Appointment"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="secondary-button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;