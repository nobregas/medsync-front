import { CalendarX, CheckCircle2, Pencil } from "lucide-react";
import { Link } from "react-router-dom";

import { CrudTable, type CrudTableColumn } from "@/components/crud/CrudTable";
import { formatDateToBr } from "@/lib/date";

import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { Appointment } from "../types";

type AppointmentTableProps = {
  appointments: Appointment[];
  patients: Patient[];
  doctors: Doctor[];
  canEdit: boolean;
  canCancel: boolean;
  canComplete: boolean;
  cancellingAppointmentId?: string | null;
  completingAppointmentId?: string | null;
  onCancel: (appointment: Appointment) => void;
  onComplete: (appointment: Appointment) => void;
};

function findPatientName(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.fullName ?? "Paciente não encontrado";
}

function findDoctorName(doctors: Doctor[], doctorId: string) {
  return doctors.find((doctor) => doctor.id === doctorId)?.name ?? "Médico não encontrado";
}

export function AppointmentTable({
  appointments,
  patients,
  doctors,
  canEdit,
  canCancel,
  canComplete,
  cancellingAppointmentId,
  completingAppointmentId,
  onCancel,
  onComplete,
}: AppointmentTableProps) {
  const columns: CrudTableColumn<Appointment>[] = [
    {
      header: "Paciente",
      render: (appointment) => (
        <div className="patient-name-content">
          <strong>{findPatientName(patients, appointment.patientId)}</strong>
          {appointment.notes && <span className="patient-registered-at">{appointment.notes}</span>}
        </div>
      ),
    },
    {
      header: "Médico",
      render: (appointment) => findDoctorName(doctors, appointment.doctorId),
    },
    {
      header: "Data",
      className: "table-fixed-data",
      render: (appointment) => formatDateToBr(appointment.date),
    },
    {
      header: "Horário",
      className: "table-fixed-data",
      render: (appointment) => appointment.time,
    },
    {
      header: "Status",
      render: (appointment) => <AppointmentStatusBadge status={appointment.status} />,
    },
  ];

  if (canEdit || canCancel || canComplete) {
    columns.push({
      header: "Ações",
      render: (appointment) => {
        const isCancelling = cancellingAppointmentId === appointment.id;
        const isCompleting = completingAppointmentId === appointment.id;
        const canCancelAppointment = canCancel && appointment.status === "scheduled";
        const canCompleteAppointment = canComplete && appointment.status === "scheduled";

        return (
          <div className="table-actions">
            {canEdit && (
              <Link
                className="button table-action-edit table-action"
                to={`/appointments/${appointment.id}/edit`}
                aria-label="Editar consulta"
              >
                <Pencil size={16} aria-hidden="true" />
              </Link>
            )}
            {canComplete && (
              <button
                className="button table-action-edit table-action"
                type="button"
                onClick={() => onComplete(appointment)}
                disabled={!canCompleteAppointment || isCompleting}
              >
                <CheckCircle2 size={16} aria-hidden="true" />
                Realizada
              </button>
            )}
            {canCancel && (
              <button
                className="button table-action-delete table-action"
                type="button"
                onClick={() => onCancel(appointment)}
                disabled={!canCancelAppointment || isCancelling}
              >
                <CalendarX size={16} aria-hidden="true" />
                Cancelar
              </button>
            )}
          </div>
        );
      },
    });
  }

  return (
    <CrudTable
      columns={columns}
      getRowKey={(appointment) => appointment.id}
      items={appointments}
      minWidth={980}
    />
  );
}
