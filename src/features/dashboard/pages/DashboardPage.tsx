import { useEffect, useState } from "react";

import { appointmentStatusLabel, appointmentStatusVariant } from "@/features/appointments/types";
import { formatDateToBr, getToday } from "@/lib/date";
import { getAppointments } from "@/services/appointment.service";
import { getDoctors } from "@/services/doctor.service";
import { getPatients } from "@/services/patient.service";

import { DashboardMetricCard } from "../components/DashboardMetricCard";
import type { Appointment } from "@/features/appointments/types";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { DashboardAppointment, DashboardMetric } from "../types";

const dashboardReferenceDate = getToday();

function findPatientName(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.fullName ?? "Paciente não encontrado";
}

function findDoctorName(doctors: Doctor[], doctorId: string) {
  return doctors.find((doctor) => doctor.id === doctorId)?.name ?? "Médico não encontrado";
}

function toDashboardAppointment(
  appointment: Appointment,
  patients: Patient[],
  doctors: Doctor[],
  showDate: boolean,
): DashboardAppointment {
  const doctor = findDoctorName(doctors, appointment.doctorId);

  return {
    id: appointment.id,
    time: appointment.time,
    patient: findPatientName(patients, appointment.patientId),
    doctor: showDate ? `${doctor} · ${formatDateToBr(appointment.date)}` : doctor,
    status: appointment.status,
  };
}

function buildMetrics(params: {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
}): DashboardMetric[] {
  const referenceMonth = dashboardReferenceDate.slice(0, 7);
  const todayAppointments = params.appointments.filter(
    (appointment) => appointment.date === dashboardReferenceDate && appointment.status === "scheduled",
  );
  const monthAppointments = params.appointments.filter((appointment) =>
    appointment.date.startsWith(referenceMonth),
  );

  return [
    {
      title: "Consultas hoje",
      value: todayAppointments.length,
      description: `Agendadas para ${formatDateToBr(dashboardReferenceDate)}`,
    },
    {
      title: "Pacientes cadastrados",
      value: params.patients.length,
      description: "Total no sistema",
    },
    {
      title: "Consultas este mês",
      value: monthAppointments.length,
      description: `Agendamentos em ${referenceMonth}`,
    },
    {
      title: "Médicos disponíveis",
      value: params.doctors.length,
      description: "Profissionais cadastrados",
    },
  ];
}

export function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<DashboardAppointment[]>([]);
  const [monthAppointments, setMonthAppointments] = useState<DashboardAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const [appointmentData, patientData, doctorData] = await Promise.all([
          getAppointments(),
          getPatients(),
          getDoctors(),
        ]);
        const referenceMonth = dashboardReferenceDate.slice(0, 7);
        const sortByDateTime = (first: Appointment, second: Appointment) => {
          const dateComparison = first.date.localeCompare(second.date);
          return dateComparison || first.time.localeCompare(second.time);
        };

        if (!isMounted) return;

        setMetrics(
          buildMetrics({
            appointments: appointmentData,
            patients: patientData,
            doctors: doctorData,
          }),
        );
        setTodayAppointments(
          appointmentData
            .filter(
              (appointment) =>
                appointment.date === dashboardReferenceDate && appointment.status === "scheduled",
            )
            .sort(sortByDateTime)
            .map((appointment) => toDashboardAppointment(appointment, patientData, doctorData, false)),
        );
        setMonthAppointments(
          appointmentData
            .filter((appointment) => appointment.date.startsWith(referenceMonth))
            .sort(sortByDateTime)
            .map((appointment) => toDashboardAppointment(appointment, patientData, doctorData, true)),
        );
        setError(null);
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os dados do dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="dashboard-page">
      <section className="page-header"></section>

      {error && <p className="patient-feedback danger">{error}</p>}

      <section className="grid metric-grid" aria-label="Métricas principais">
        {metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            description={metric.description}
          />
        ))}
      </section>

      <section className="grid dashboard-grid">
        <article className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Agenda do dia</h3>
              <p className="section-description">Próximos horários organizados para a recepção.</p>
            </div>
            <span className="badge info">Sem conflitos</span>
          </div>

          <div className="schedule-list scroll-container">
            {isLoading ? (
              <div className="empty-state">
                <h3>Carregando agenda...</h3>
                <p>Sincronizando consultas mockadas e locais.</p>
              </div>
            ) : todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment.id}>
                  <strong className="appointment-time">{appointment.time}</strong>
                  <div>
                    <p className="appointment-patient">{appointment.patient}</p>
                    <p className="appointment-meta">{appointment.doctor}</p>
                  </div>
                  <span className={`badge ${appointmentStatusVariant[appointment.status]}`}>
                    {appointmentStatusLabel[appointment.status]}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>Nenhuma consulta hoje</h3>
                <p>Não há consultas agendadas para {formatDateToBr(dashboardReferenceDate)}.</p>
              </div>
            )}
          </div>
        </article>

        <article className="card">
          <div className="section-header">
            <div>
              <h3 className="section-title">Consultas deste mês</h3>
              <p className="section-description">Visão geral dos agendamentos de abril.</p>
            </div>
          </div>

          <div className="schedule-list scroll-container">
            {isLoading ? (
              <div className="empty-state">
                <h3>Carregando mês...</h3>
                <p>Conferindo consultas cadastradas.</p>
              </div>
            ) : monthAppointments.length > 0 ? (
              monthAppointments.map((appointment) => (
                <div className="appointment-card" key={appointment.id}>
                  <strong className="appointment-time">{appointment.time}</strong>
                  <div>
                    <p className="appointment-patient">{appointment.patient}</p>
                    <p className="appointment-meta">{appointment.doctor}</p>
                  </div>
                  <span className={`badge ${appointmentStatusVariant[appointment.status]}`}>
                    {appointmentStatusLabel[appointment.status]}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>Nenhuma consulta no mês</h3>
                <p>Os agendamentos do mês aparecerão aqui.</p>
              </div>
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
