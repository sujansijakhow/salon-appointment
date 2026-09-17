import type { AppointmentStatus } from "../../types";

const statusStyles: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const statusLabels: Record<AppointmentStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const StatusBadge = ({ status }: { status: AppointmentStatus }) => (
  <span
    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
  >
    {statusLabels[status]}
  </span>
);

export default StatusBadge;