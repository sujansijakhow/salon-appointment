import { Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Appointment, AppointmentStatus } from "../../types";

interface AppointmentTableProps {
  appointments: Appointment[];
  onStatusChange: (id: number, status: AppointmentStatus) => void;
  onDelete: (id: number) => void;
  updatingId?: number;
  deletingId?: number;
}

const nextStatusOptions: Record<AppointmentStatus, AppointmentStatus[]> = {
  PENDING: ["PENDING", "CONFIRMED", "CANCELLED"],
  CONFIRMED: ["CONFIRMED", "COMPLETED", "CANCELLED"],
  COMPLETED: ["COMPLETED"],
  CANCELLED: ["CANCELLED"],
};

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const AppointmentTable = ({
  appointments,
  onStatusChange,
  onDelete,
  updatingId,
  deletingId,
}: AppointmentTableProps) => {
  if (appointments.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No appointments found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Customer
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Service
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Time
            </th>
            <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              Status
            </th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {appointments.map((appointment) => {
            const options = nextStatusOptions[appointment.status];
            const isLocked = options.length === 1;

            return (
              <tr key={appointment.id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {appointment.customer_name}
                  <div className="text-xs text-gray-500">{appointment.customer_phone}</div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">{appointment.service_name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{appointment.date}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{appointment.time}</td>
                <td className="px-4 py-2 text-sm">
                  {isLocked ? (
                    <StatusBadge status={appointment.status} />
                  ) : (
                    <select
                      value={appointment.status}
                      disabled={updatingId === appointment.id}
                      onChange={(e) =>
                        onStatusChange(appointment.id, e.target.value as AppointmentStatus)
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 disabled:opacity-50"
                    >
                      {options.map((status) => (
                        <option key={status} value={status}>
                          {statusLabels[status]}
                        </option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-2 text-right text-sm">
                  <button
                    onClick={() => onDelete(appointment.id)}
                    disabled={deletingId === appointment.id}
                    className="text-gray-500 hover:text-red-600 disabled:opacity-50 cursor-pointer"
                    aria-label={`Delete appointment for ${appointment.customer_name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;