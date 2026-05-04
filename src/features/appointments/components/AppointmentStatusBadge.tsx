import { appointmentStatusLabel, appointmentStatusVariant } from "../types";
import type { AppointmentStatus } from "../types";

type AppointmentStatusBadgeProps = {
  status: AppointmentStatus;
};

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  return (
    <span className={`badge ${appointmentStatusVariant[status]}`}>
      {appointmentStatusLabel[status]}
    </span>
  );
}
