import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import { CrudTable, type CrudTableColumn } from "@/components/crud/CrudTable";
import { formatDateToBr } from "@/lib/date";

import type { Patient } from "../types";

type PatientTableProps = {
  patients: Patient[];
  deletingPatientId?: string | null;
  onDelete: (patient: Patient) => void;
};

function getPatientInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();

  return initials || "?";
}

export function PatientTable({ patients, deletingPatientId, onDelete }: PatientTableProps) {
  const columns: CrudTableColumn<Patient>[] = [
    {
      header: "Paciente",
      render: (patient) => (
        <div className="patient-name-cell">
          <span className="patient-avatar" aria-hidden="true">
            {getPatientInitials(patient.fullName)}
          </span>
          <div className="patient-name-content">
            <strong>{patient.fullName}</strong>
            <span className="patient-registered-at">
              Cadastrado em {formatDateToBr(patient.createdAt)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Nascimento",
      render: (patient) => formatDateToBr(patient.birthDate),
    },
    {
      header: "CPF",
      className: "table-fixed-data",
      render: (patient) => patient.cpf,
    },
    {
      header: "Telefone",
      className: "table-fixed-data",
      render: (patient) => patient.phone,
    },
    {
      header: "Convênio",
      render: (patient) => {
        const healthInsuranceLabel = patient.healthInsurance || "Sem convênio";
        const badgeVariant = patient.healthInsurance ? "info" : "warning";

        return <span className={`badge ${badgeVariant}`}>{healthInsuranceLabel}</span>;
      },
    },
    {
      header: "Ações",
      render: (patient) => {
        const isDeleting = deletingPatientId === patient.id;

        return (
          <div className="table-actions">
            <Link className="button table-action-edit table-action" to={`/patients/${patient.id}/edit`}>
              <Pencil size={16} aria-hidden="true" />
            </Link>
            <button
              className="button table-action-delete table-action"
              type="button"
              onClick={() => onDelete(patient)}
              disabled={isDeleting}
            >
              <Trash2 size={16} aria-hidden="true" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <CrudTable
      columns={columns}
      getRowKey={(patient) => patient.id}
      items={patients}
      minWidth={900}
    />
  );
}
