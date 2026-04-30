import type { Appointment, AppointmentStatus } from "@/features/appointments/types";
import { 
  appointmentsMock, 
  getAppointmentsByPatient,
  hasScheduleConflict 
} from "@/features/appointments/mock";

export async function getAppointments(): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return appointmentsMock;
}

export async function getAppointmentsByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return appointmentsMock.filter((a) => {
    return a.date >= startDate && a.date <= endDate;
  });
}

export async function getAppointment(id: string): Promise<Appointment | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return appointmentsMock.find((a) => a.id === id) ?? null;
}

export async function getPatientAppointments(patientId: string): Promise<Appointment[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getAppointmentsByPatient(patientId);
}

export async function createAppointment(data: {
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
}): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const conflict = hasScheduleConflict(data.doctorId, data.date, data.time);
  if (conflict) {
    throw new Error("Conflito de horário: Este médico já possui uma consulta neste horário");
  }
  
  const newAppointment: Appointment = {
    id: String(Date.now()),
    ...data,
    status: "scheduled",
  };
  
  appointmentsMock.push(newAppointment);
  return newAppointment;
}

export async function updateAppointment(
  id: string, 
  data: Partial<Appointment>
): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = appointmentsMock.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }
  
  if (data.doctorId && data.date && data.time) {
    const conflict = hasScheduleConflict(data.doctorId, data.date, data.time, id);
    if (conflict) {
      throw new Error("Conflito de horário: Este médico já possui uma consulta neste horário");
    }
  }
  
  const updated = {
    ...appointmentsMock[index],
    ...data,
  };
  
  appointmentsMock[index] = updated;
  return updated;
}

export async function updateAppointmentStatus(
  id: string, 
  status: AppointmentStatus
): Promise<Appointment> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  const index = appointmentsMock.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }
  
  appointmentsMock[index].status = status;
  return appointmentsMock[index];
}

export async function deleteAppointment(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = appointmentsMock.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Consulta não encontrada");
  }
  
  appointmentsMock.splice(index, 1);
}
