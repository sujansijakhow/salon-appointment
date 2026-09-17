import { useState, useEffect } from "react";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { useServices } from "../hooks/useServices";
import {
  useAppointments,
  useCreateAppointment,
  useUpdateAppointmentStatus,
  useDeleteAppointment,
} from "../hooks/useAppointment";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentTable from "../components/appointments/AppointmentTable";
import Modal from "../components/ui/Modal";
import type { AppointmentFormValues } from "../schemas/appointmentSchema";
import type { ApiErrorResponse, AppointmentStatus } from "../types";

const FILTER_OPTIONS: { label: string; value: AppointmentStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const AppointmentsPage = () => {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: services, isLoading: servicesLoading } = useServices();
  const {
    data: appointments,
    isLoading: appointmentsLoading,
    isError: appointmentsError,
    error: appointmentsErrorObj,
  } = useAppointments({
    status: statusFilter || undefined,
    date: dateFilter || undefined,
    search: debouncedSearch || undefined,
  });

  const createMutation = useCreateAppointment();
  const statusMutation = useUpdateAppointmentStatus();
  const deleteMutation = useDeleteAppointment();

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

  const handleStatusChange = (id: number, status: AppointmentStatus) => {
    statusMutation.mutate(
      { id, status },
      {
        onSuccess: () => setSuccessMessage("Appointment status updated."),
      }
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this appointment? This cannot be undone.")) {
      deleteMutation.mutate(id, {
        onSuccess: () => setSuccessMessage("Appointment deleted."),
      });
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Appointments</h1>
        <button
          onClick={openForm}
          disabled={servicesLoading}
          className="primary-button flex items-center justify-center gap-1 cursor-pointer"
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

      {deleteMutation.isError && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          Failed to delete appointment.
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input sm:w-auto"
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-input sm:w-auto"
        />
        {(dateFilter || searchInput) && (
          <button
            onClick={() => {
              setDateFilter("");
              setSearchInput("");
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => setStatusFilter(option.value)}
            className={`filter-button ${
              statusFilter === option.value
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {appointmentsLoading && (
        <p className="p-6 text-sm text-gray-500">Loading appointments...</p>
      )}
      {appointmentsError && (
        <p role="alert" className="p-6 text-sm text-red-600">
          Error: {(appointmentsErrorObj as Error).message}
        </p>
      )}
      {!appointmentsLoading && !appointmentsError && (
        <AppointmentTable
          appointments={appointments ?? []}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          updatingId={statusMutation.isPending ? statusMutation.variables?.id : undefined}
          deletingId={deleteMutation.isPending ? deleteMutation.variables : undefined}
        />
      )}

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