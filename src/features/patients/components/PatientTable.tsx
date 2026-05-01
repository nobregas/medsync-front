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

export function PatientTable({ patients, deletingPatientId, onDelete }: PatientTableProps) {
  const columns: CrudTableColumn<Patient>[] = [
    {
      header: "Paciente",
      render: (patient) => (
        <div className="patient-name-cell">
          <strong>{patient.fullName}</strong>
          <span>Cadastrado em {formatDateToBr(patient.createdAt)}</span>
        </div>
      ),
    },
    {
      header: "Nascimento",
      render: (patient) => formatDateToBr(patient.birthDate),
    },
    {
      header: "CPF",
      render: (patient) => patient.cpf,
    },
    {
      header: "Telefone",
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
            <Link className="button secondary table-action" to={`/patients/${patient.id}/edit`}>
              <Pencil size={16} aria-hidden="true" />
              Editar
            </Link>
            <button
              className="button danger table-action"
              type="button"
              onClick={() => onDelete(patient)}
              disabled={isDeleting}
            >
              <Trash2 size={16} aria-hidden="true" />
              {isDeleting ? "Excluindo" : "Excluir"}
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
