import type { Appointment, AppointmentStatus } from "@/features/appointments/types";
import { appointmentsMock } from "@/features/appointments/mock";
import { hasDoctorScheduleConflict } from "@/features/appointments/utils/appointmentRules";

type AppointmentPayload = Omit<Appointment, "id" | "status">;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readAppointments(): Appointment[] {
  return [...appointmentsMock];
}

export async function getAppointments(): Promise<Appointment[]> {
  await delay(300);
  return readAppointments();
}

export async function getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
  await delay(300);
  
  return readAppointments().filter((a) => {
    return a.date >= startDate && a.date <= endDate;
  });
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  await delay(200);
  return readAppointments().find((a) => a.id === id) ?? null;
}

export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  await delay(300);
  return readAppointments().filter((appointment) => appointment.patientId === patientId);
}

export async function createAppointment(data: AppointmentPayload): Promise<Appointment> {
  await delay(500);
  const appointments = readAppointments();
  
  const conflict = hasDoctorScheduleConflict({
    appointments,
    doctorId: data.doctorId,
    date: data.date,
    time: data.time,
  });

  if (conflict) {
    throw new Error("Este médico já possui consulta nesse horário.");
  }
  
  const newAppointment: Appointment = {
    id: String(Date.now()),
    ...data,
    status: "scheduled",
  };
  
  appointments.push(newAppointment);
  return newAppointment;
}

export async function updateAppointment(
  id: string, 
  data: Partial<Appointment>
): Promise<Appointment> {
  await delay(500);
  const appointments = readAppointments();
  
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }

  const nextAppointment = {
    ...appointments[index],
    ...data,
  };
  
  if (nextAppointment.status !== "cancelled") {
    const conflict = hasDoctorScheduleConflict({
      appointments,
      doctorId: nextAppointment.doctorId,
      date: nextAppointment.date,
      time: nextAppointment.time,
      excludeId: id,
    });

    if (conflict) {
      throw new Error("Este médico já possui consulta nesse horário.");
    }
  }
  
  appointments[index] = nextAppointment;
  return nextAppointment;
}

export async function updateAppointmentStatus(
  id: string, 
  status: AppointmentStatus
): Promise<Appointment> {
  await delay(300);
  const appointments = readAppointments();
  
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }
  
  appointments[index] = {
    ...appointments[index],
    status,
  };
  return appointments[index];
}

export async function deleteAppointment(id: string): Promise<void> {
  await delay(500);
  const appointments = readAppointments();
  
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }
  
  appointments.splice(index, 1);
}