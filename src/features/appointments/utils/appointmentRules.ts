import type { Appointment } from "../types";

type DoctorScheduleConflictParams = {
  appointments: Appointment[];
  doctorId: string;
  date: string;
  time: string;
  excludeId?: string;
};

export function hasDoctorScheduleConflict({
  appointments,
  doctorId,
  date,
  time,
  excludeId,
}: DoctorScheduleConflictParams): boolean {
  return appointments.some(
    (appointment) =>
      appointment.doctorId === doctorId &&
      appointment.date === date &&
      appointment.time === time &&
      appointment.status !== "cancelled" &&
      appointment.id !== excludeId,
  );
}
