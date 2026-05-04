import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { formatDateToBr } from "@/lib/date";
import { getAppointments } from "@/services/appointment.service";
import { getDoctors } from "@/services/doctor.service";
import { getPatients } from "@/services/patient.service";
import { canAccess, permissions } from "@/types/role";

import { WeeklyCalendar } from "../components/WeeklyCalendar";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { Appointment } from "../types";

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekStart(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  weekStart.setDate(weekStart.getDate() + diff);

  return toIsoDate(weekStart);
}

function addDays(date: string, amount: number) {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + amount);

  return toIsoDate(nextDate);
}

export function CalendarPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [weekStartDate, setWeekStartDate] = useState(() => getWeekStart(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canCreateAppointment = user ? canAccess(user.role, permissions.appointmentCreate) : false;
  const weekEndDate = addDays(weekStartDate, 6);
  const weekAppointments = appointments.filter(
    (appointment) => appointment.date >= weekStartDate && appointment.date <= weekEndDate,
  );

  useEffect(() => {
    let isMounted = true;

    async function loadCalendar() {
      try {
        const [appointmentData, patientData, doctorData] = await Promise.all([
          getAppointments(),
          getPatients(),
          getDoctors(),
        ]);

        if (!isMounted) return;

        setAppointments(appointmentData);
        setPatients(patientData);
        setDoctors(doctorData);
        setError(null);
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar o calendário.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCalendar();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="patients-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Calendário</p>
          <h2 className="page-title">Agenda semanal</h2>
        </div>
        <div className="button-row">
          {canCreateAppointment && (
            <Link className="button primary" to="/appointments/new">
              <CalendarPlus size={18} aria-hidden="true" />
              Nova consulta
            </Link>
          )}
        </div>
      </section>

      <section className="card calendar-toolbar">
        <div>
          <h3 className="section-title">Semana selecionada</h3>
          <p className="section-description">
            {formatDateToBr(weekStartDate)} a {formatDateToBr(weekEndDate)}
          </p>
        </div>
        <div className="button-row">
          <button
            className="button secondary"
            type="button"
            onClick={() => setWeekStartDate((current) => addDays(current, -7))}
          >
            <ChevronLeft size={17} aria-hidden="true" />
            Semana anterior
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => setWeekStartDate(getWeekStart(new Date()))}
          >
            Semana atual
          </button>
          <button
            className="button secondary"
            type="button"
            onClick={() => setWeekStartDate((current) => addDays(current, 7))}
          >
            Próxima semana
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </div>
      </section>

      {error && <p className="patient-feedback danger">{error}</p>}

      {isLoading ? (
        <div className="empty-state">
          <h3>Carregando calendário...</h3>
          <p>Organizando as consultas da semana.</p>
        </div>
      ) : (
        <WeeklyCalendar
          appointments={weekAppointments}
          patients={patients}
          doctors={doctors}
          weekStartDate={weekStartDate}
        />
      )}
    </div>
  );
}
