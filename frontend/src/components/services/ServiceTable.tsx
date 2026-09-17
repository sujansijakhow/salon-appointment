import { Pencil, Trash2 } from "lucide-react";
import type { Service } from "../../types";

interface ServiceTableProps {
  services: Service[];
  onEdit: (service: Service) => void;
  onDelete: (id: number) => void;
  deletingId?: number;
}

const ServiceTable = ({
  services,
  onEdit,
  onDelete,
  deletingId,
}: ServiceTableProps) => {
  if (services.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No services yet. Add one to get started.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Price (NPR)
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Duration (min)
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {services.map((service) => (
            <tr key={service.id}>
              <td className="px-4 py-2 text-sm text-gray-900">{service.name}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{service.price}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{service.duration}</td>
              <td className="px-4 py-2 text-right text-sm">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => onEdit(service)}
                    className="text-gray-500 hover:text-indigo-600 cursor-pointer"
                    aria-label={`Edit ${service.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(service.id)}
                    disabled={deletingId === service.id}
                    className="text-gray-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                    aria-label={`Delete ${service.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceTable;