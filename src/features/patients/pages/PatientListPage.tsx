import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Input } from "@/components/common/Input";
import { ActiveFilterChips, type ActiveFilterChip } from "@/components/crud/ActiveFilterChips";
import { CrudFilterSection } from "@/components/crud/CrudFilterSection";
import { CrudTableSection } from "@/components/crud/CrudTableSection";
import { formatCpf, onlyDigits } from "@/lib/cpf";
import { deletePatient, getPatients } from "@/services/patient.service";

import { PatientTable } from "../components/PatientTable";
import type { Patient } from "../types";

type PatientFilters = {
  fullName: string;
  cpf: string;
};

const emptyPatientFilters: PatientFilters = {
  fullName: "",
  cpf: "",
};

export function PatientListPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filters, setFilters] = useState<PatientFilters>(emptyPatientFilters);
  const [appliedFilters, setAppliedFilters] = useState<PatientFilters>(emptyPatientFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingPatientId, setDeletingPatientId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPatients() {
      try {
        const data = await getPatients();

        if (isMounted) {
          setPatients(data);
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("Não foi possível carregar os pacientes.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPatients();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedNameFilter = appliedFilters.fullName.trim().toLowerCase();
  const cpfFilterDigits = onlyDigits(appliedFilters.cpf);
  const visiblePatients = patients
    .filter((patient) => {
      const matchesName =
        !normalizedNameFilter || patient.fullName.toLowerCase().includes(normalizedNameFilter);
      const matchesCpf = !cpfFilterDigits || onlyDigits(patient.cpf).includes(cpfFilterDigits);

      return matchesName && matchesCpf;
    })
    .sort((first, second) => first.fullName.localeCompare(second.fullName));

  const activeFilters: ActiveFilterChip[] = [
    ...(appliedFilters.fullName.trim()
      ? [{ id: "fullName", value: appliedFilters.fullName.trim() }]
      : []),
    ...(appliedFilters.cpf.trim() ? [{ id: "cpf", value: formatCpf(appliedFilters.cpf) }] : []),
  ];

  const hasDraftFilters = Boolean(filters.fullName.trim() || filters.cpf.trim());
  const hasAppliedFilters = Boolean(appliedFilters.fullName.trim() || appliedFilters.cpf.trim());
  const canClearFilters = hasDraftFilters || hasAppliedFilters;

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      fullName: filters.fullName.trim(),
      cpf: filters.cpf.trim(),
    });
  };

  const handleClearFilters = () => {
    setFilters(emptyPatientFilters);
    setAppliedFilters(emptyPatientFilters);
  };

  const handleRemoveFilter = (filter: ActiveFilterChip) => {
    const filterId = filter.id as keyof PatientFilters;

    setFilters((current) => ({ ...current, [filterId]: "" }));
    setAppliedFilters((current) => ({ ...current, [filterId]: "" }));
  };

  const handleDelete = async (patient: Patient) => {
    const confirmed = window.confirm(`Deseja excluir o paciente ${patient.fullName}?`);

    if (!confirmed) return;

    setDeletingPatientId(patient.id);
    setError(null);

    try {
      await deletePatient(patient.id);
      setPatients((current) => current.filter((item) => item.id !== patient.id));
    } catch {
      setError("Não foi possível excluir o paciente.");
    } finally {
      setDeletingPatientId(null);
    }
  };

  return (
    <div className="patients-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Pacientes</p>
          <h2 className="page-title">Cadastro e busca de pacientes</h2>
        </div>
        <Link className="button primary" to="/patients/new">
          <Plus size={18} aria-hidden="true" />
          Novo paciente
        </Link>
      </section>

      <CrudFilterSection
        onSubmit={handleFilterSubmit}
        onClear={handleClearFilters}
        canClear={canClearFilters}
        disabled={isLoading}
      >
        <Input
          name="patientNameFilter"
          label="Nome"
          placeholder="Digite o nome do paciente"
          value={filters.fullName}
          onChange={(event) =>
            setFilters((current) => ({ ...current, fullName: event.target.value }))
          }
          autoComplete="off"
          disabled={isLoading}
        />

        <Input
          name="patientCpfFilter"
          label="CPF"
          placeholder="000.000.000-00"
          value={filters.cpf}
          onChange={(event) =>
            setFilters((current) => ({ ...current, cpf: formatCpf(event.target.value) }))
          }
          inputMode="numeric"
          maxLength={14}
          disabled={isLoading}
        />
      </CrudFilterSection>

      <ActiveFilterChips filters={activeFilters} onRemove={handleRemoveFilter} />

      <CrudTableSection>
        {error && <p className="patient-feedback danger">{error}</p>}

        {isLoading ? (
          <div className="empty-state">
            <h3>Carregando pacientes...</h3>
            <p>Buscando os dados mockados da recepção.</p>
          </div>
        ) : visiblePatients.length > 0 ? (
          <PatientTable
            patients={visiblePatients}
            deletingPatientId={deletingPatientId}
            onDelete={handleDelete}
          />
        ) : (
          <div className="empty-state">
            <h3>Nenhum paciente encontrado</h3>
            <p>Cadastre um novo paciente ou ajuste o termo de busca informado.</p>
          </div>
        )}
      </CrudTableSection>
    </div>
  );
}
