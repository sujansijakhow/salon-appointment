import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { useServices } from "../hooks/useServices";
import { useCreateAppointment } from "../hooks/useAppointment";
import AppointmentForm from "../components/appointments/AppointmentForm";
import Modal from "../components/ui/Modal";
import type { AppointmentFormValues } from "../schemas/appointmentSchema";
import type { ApiErrorResponse } from "../types";

const AppointmentsPage = () => {
  const { data: services, isLoading: servicesLoading } = useServices();
  const createMutation = useCreateAppointment();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const openForm = () => {
    setSubmitError(undefined);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSubmitError(undefined);
  };

  const handleSubmit = (data: AppointmentFormValues) => {
    setSubmitError(undefined);
    createMutation.mutate(
      {
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        service: data.service,
        date: data.date,
        time: data.time,
        notes: data.notes ?? "",
      },
      {
        onSuccess: () => {
          closeForm();
          setSuccessMessage(`Appointment booked for ${data.customer_name}.`);
        },
        onError: (error) => {
          if (isAxiosError<ApiErrorResponse>(error) && error.response?.data) {
            const body = error.response.data;
            const message =
              body.non_field_errors ??
              body.customer_name ??
              body.customer_phone ??
              body.service ??
              body.date ??
              body.time;
            setSubmitError(
              Array.isArray(message)
                ? message[0]
                : message ?? "Something went wrong. Please try again."
            );
          } else {
            setSubmitError("Something went wrong. Please try again.");
          }
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <button
          onClick={openForm}
          disabled={servicesLoading}
          className="flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 cursor-pointer"
        >
          <Plus size={16} />
          Book Appointment
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {/* Appointment table + status filter come in Phase 8 */}

      <Modal isOpen={isFormOpen} onClose={closeForm} title="Book Appointment">
        <AppointmentForm
          services={services ?? []}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={createMutation.isPending}
          submitError={submitError}
        />
      </Modal>
    </div>
  );
};

export default AppointmentsPage;