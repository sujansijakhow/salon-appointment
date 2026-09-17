import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from "../hooks/useServices";
import ServiceForm from "../components/services/ServiceForm";
import ServiceTable from "../components/services/ServiceTable";
import Modal from "../components/ui/Modal";
import type { Service } from "../types";
import type { ServiceFormValues } from "../schemas/serviceSchema";

const ServicesPage = () => {
  const { data: services, isLoading, isError, error } = useServices();
  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const openCreateForm = () => {
    setEditingService(undefined);
    setIsFormOpen(true);
  };

  const openEditForm = (service: Service) => {
    setEditingService(service);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingService(undefined);
  };

  const handleSubmit = (data: ServiceFormValues) => {
    if (editingService) {
      updateMutation.mutate(
        { id: editingService.id, data },
        {
          onSuccess: () => {
            closeForm();
            setSuccessMessage(`"${data.name}" was updated successfully.`);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          closeForm();
          setSuccessMessage(`"${data.name}" was added successfully.`);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Delete this service? This cannot be undone.")) {
      const service = services?.find((s) => s.id === id);
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setSuccessMessage(
            service ? `"${service.name}" was deleted.` : "Service was deleted."
          );
        },
      });
    }
  };

  if (isLoading)
    return <p className="p-6 text-sm text-gray-500">Loading services...</p>;
  if (isError)
    return (
      <p role="alert" className="p-6 text-sm text-red-600">
        Error: {(error as Error).message}
      </p>
    );

  const activeMutation = editingService ? updateMutation : createMutation;

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
        <button
          onClick={openCreateForm}
          className="flex items-center justify-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 cursor-pointer"
        >
          <Plus size={16} />
          Add Service
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
          Failed to delete service. It may have existing appointments.
        </p>
      )}

      <ServiceTable
        services={services ?? []}
        onEdit={openEditForm}
        onDelete={handleDelete}
        deletingId={deleteMutation.isPending ? deleteMutation.variables : undefined}
      />

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingService ? "Edit Service" : "Add Service"}
      >
        <ServiceForm
          initialValues={editingService}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          isSubmitting={activeMutation.isPending}
          submitError={
            activeMutation.isError
              ? "Something went wrong. Please check the form and try again."
              : undefined
          }
        />
      </Modal>
    </div>
  );
};

export default ServicesPage;