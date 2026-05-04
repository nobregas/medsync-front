import type { Appointment } from "./types";

export const appointmentsMock: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    doctorId: "1",
    date: "2026-05-04",
    time: "09:00",
    status: "scheduled",
    notes: "Retorno",
  },
  {
    id: "2",
    patientId: "2",
    doctorId: "1",
    date: "2026-05-04",
    time: "10:00",
    status: "scheduled",
  },
  {
    id: "3",
    patientId: "3",
    doctorId: "2",
    date: "2026-05-04",
    time: "14:00",
    status: "scheduled",
  },
  {
    id: "4",
    patientId: "4",
    doctorId: "3",
    date: "2026-05-05",
    time: "09:00",
    status: "scheduled",
  },
  {
    id: "5",
    patientId: "5",
    doctorId: "1",
    date: "2026-05-05",
    time: "11:00",
    status: "scheduled",
  },
  {
    id: "6",
    patientId: "1",
    doctorId: "1",
    date: "2026-04-20",
    time: "10:00",
    status: "completed",
    notes: "Consulta de rotina",
  },
  {
    id: "7",
    patientId: "2",
    doctorId: "2",
    date: "2026-04-22",
    time: "15:00",
    status: "completed",
  },
  {
    id: "8",
    patientId: "3",
    doctorId: "1",
    date: "2026-04-25",
    time: "09:00",
    status: "cancelled",
    notes: "Paciente cancelou",
  },
  {
    id: "9",
    patientId: "4",
    doctorId: "3",
    date: "2026-04-15",
    time: "14:00",
    status: "completed",
  },
  {
    id: "10",
    patientId: "5",
    doctorId: "2",
    date: "2026-04-10",
    time: "10:00",
    status: "completed",
  },
  {
    id: "11",
    patientId: "1",
    doctorId: "2",
    date: "2026-05-06",
    time: "15:00",
    status: "scheduled",
  },
  {
    id: "12",
    patientId: "2",
    doctorId: "3",
    date: "2026-05-07",
    time: "08:30",
    status: "scheduled",
  },
  {
    id: "13",
    patientId: "3",
    doctorId: "1",
    date: "2026-05-08",
    time: "10:30",
    status: "scheduled",
  },
  {
    id: "14",
    patientId: "4",
    doctorId: "2",
    date: "2026-05-09",
    time: "13:00",
    status: "scheduled",
  },
  {
    id: "15",
    patientId: "5",
    doctorId: "3",
    date: "2026-05-10",
    time: "09:00",
    status: "scheduled",
  },
];

export function getAppointmentsByDate(date: string): Appointment[] {
  return appointmentsMock.filter((a) => a.date === date);
}

export function getAppointmentsByDoctor(doctorId: string): Appointment[] {
  return appointmentsMock.filter((a) => a.doctorId === doctorId);
}

export function getAppointmentsByPatient(patientId: string): Appointment[] {
  return appointmentsMock.filter((a) => a.patientId === patientId);
}

export function hasScheduleConflict(
  doctorId: string,
  date: string,
  time: string,
  excludeId?: string,
): boolean {
  return appointmentsMock.some(
    (a) =>
      a.doctorId === doctorId &&
      a.date === date &&
      a.time === time &&
      a.status !== "cancelled" &&
      a.id !== excludeId,
  );
}

export function getTodayAppointments(): Appointment[] {
  const today = new Date().toISOString().split("T")[0];
  return appointmentsMock.filter(
    (a) => a.date === today && a.status === "scheduled",
  );
}