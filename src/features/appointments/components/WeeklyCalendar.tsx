import { formatDateToBr, getShortDayName } from "@/lib/date";

import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { Appointment } from "../types";

type WeeklyCalendarProps = {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  weekStartDate: string;
};

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekDays(weekStartDate: string) {
  const startDate = new Date(`${weekStartDate}T00:00:00`);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return toIsoDate(date);
  });
}

function findPatientName(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.fullName ?? "Paciente não encontrado";
}

function findDoctorName(doctors: Doctor[], doctorId: string) {
  return doctors.find((doctor) => doctor.id === doctorId)?.name ?? "Médico não encontrado";
}

export function WeeklyCalendar({
  appointments,
  patients,
  doctors,
  weekStartDate,
}: WeeklyCalendarProps) {
  const weekDays = getWeekDays(weekStartDate);

  return (
    <section className="weekly-calendar" aria-label="Calendário semanal de consultas">
      {weekDays.map((date) => {
        const dayAppointments = appointments
          .filter((appointment) => appointment.date === date)
          .sort((first, second) => first.time.localeCompare(second.time));

        return (
          <article className="calendar-day-card" key={date}>
            <header className="calendar-day-header">
              <span className="calendar-day-name">{getShortDayName(date)}</span>
              <strong className="calendar-day-date">{formatDateToBr(date)}</strong>
            </header>

            {dayAppointments.length > 0 ? (
              <div className="appointment-calendar-list">
                {dayAppointments.map((appointment) => (
                  <div className="appointment-card" key={appointment.id}>
                    <strong className="appointment-time">{appointment.time}</strong>
                    <div>
                      <p className="appointment-patient">
                        {findPatientName(patients, appointment.patientId)}
                      </p>
                      <p className="appointment-meta">
                        {findDoctorName(doctors, appointment.doctorId)}
                      </p>
                    </div>
                    <AppointmentStatusBadge status={appointment.status} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="calendar-empty">Nenhuma consulta.</p>
            )}
          </article>
        );
      })}
    </section>
  );
}
