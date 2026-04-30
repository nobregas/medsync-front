export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  notes?: string;
}

export type AppointmentFormData = Omit<Appointment, "id" | "status">;

export const appointmentStatusLabel = {
  scheduled: "Agendada",
  completed: "Realizada",
  cancelled: "Cancelada",
} as const;

export const appointmentStatusVariant = {
  scheduled: "info",
  completed: "success",
  cancelled: "danger",
} as const;

export type AppointmentsByDate = Record<string, Appointment[]>;