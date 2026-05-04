import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { ActiveFilterChips, type ActiveFilterChip } from "@/components/crud/ActiveFilterChips";
import { CrudFilterSection } from "@/components/crud/CrudFilterSection";
import { CrudPagination } from "@/components/crud/CrudPagination";
import { CrudTableSection } from "@/components/crud/CrudTableSection";
import { useAuth } from "@/hooks/useAuth";
import { onlyDigits } from "@/lib/cpf";
import { formatDateToBr } from "@/lib/date";
import { getAppointments, updateAppointmentStatus } from "@/services/appointment.service";
import { getDoctors } from "@/services/doctor.service";
import { getPatients } from "@/services/patient.service";
import { canAccess, permissions } from "@/types/role";

import { AppointmentTable } from "../components/AppointmentTable";
import { appointmentStatusLabel } from "../types";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { Appointment, AppointmentStatus } from "../types";

type AppointmentFilters = {
  patientQuery: string;
  doctorId: string;
  date: string;
  status: AppointmentStatus | "";
};

const emptyAppointmentFilters: AppointmentFilters = {
  patientQuery: "",
  doctorId: "",
  date: "",
  status: "",
};

const appointmentPageSize = 6;

function findPatient(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId);
}

function findDoctor(doctors: Doctor[], doctorId: string) {
  return doctors.find((doctor) => doctor.id === doctorId);
}

export function AppointmentListPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filters, setFilters] = useState<AppointmentFilters>(emptyAppointmentFilters);
  const [appliedFilters, setAppliedFilters] = useState<AppointmentFilters>(emptyAppointmentFilters);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const canCreateAppointment = user ? canAccess(user.role, permissions.appointmentCreate) : false;
  const canEditAppointments = user ? canAccess(user.role, permissions.appointmentEdit) : false;
  const canCompleteAppointments = user ? canAccess(user.role, permissions.medicalRecordCreate) : false;

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
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
          setError("Não foi possível carregar as consultas.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedPatientFilter = appliedFilters.patientQuery.trim().toLowerCase();
  const patientFilterDigits = onlyDigits(appliedFilters.patientQuery);
  const visibleAppointments = appointments
    .filter((appointment) => {
      const patient = findPatient(patients, appointment.patientId);
      const patientName = patient?.fullName.toLowerCase() ?? "";
      const patientCpf = onlyDigits(patient?.cpf ?? "");
      const matchesPatient =
        !normalizedPatientFilter ||
        patientName.includes(normalizedPatientFilter) ||
        (patientFilterDigits.length > 0 && patientCpf.includes(patientFilterDigits));
      const matchesDoctor = !appliedFilters.doctorId || appointment.doctorId === appliedFilters.doctorId;
      const matchesDate = !appliedFilters.date || appointment.date === appliedFilters.date;
      const matchesStatus = !appliedFilters.status || appointment.status === appliedFilters.status;

      return matchesPatient && matchesDoctor && matchesDate && matchesStatus;
    })
    .sort((first, second) => {
      const dateComparison = first.date.localeCompare(second.date);
      return dateComparison || first.time.localeCompare(second.time);
    });

  const totalPages = Math.max(1, Math.ceil(visibleAppointments.length / appointmentPageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const firstVisibleAppointmentIndex = (safeCurrentPage - 1) * appointmentPageSize;
  const paginatedAppointments = visibleAppointments.slice(
    firstVisibleAppointmentIndex,
    firstVisibleAppointmentIndex + appointmentPageSize,
  );
  const appointmentLabel = visibleAppointments.length === 1 ? "consulta" : "consultas";

  const activeFilters: ActiveFilterChip[] = [
    ...(appliedFilters.patientQuery.trim()
      ? [{ id: "patientQuery", value: appliedFilters.patientQuery.trim() }]
      : []),
    ...(appliedFilters.doctorId
      ? [
          {
            id: "doctorId",
            value: findDoctor(doctors, appliedFilters.doctorId)?.name ?? "Médico selecionado",
          },
        ]
      : []),
    ...(appliedFilters.date
      ? [{ id: "date", value: formatDateToBr(appliedFilters.date) }]
      : []),
    ...(appliedFilters.status
      ? [{ id: "status", value: appointmentStatusLabel[appliedFilters.status] }]
      : []),
  ];

  const hasDraftFilters = Boolean(
    filters.patientQuery.trim() || filters.doctorId || filters.date || filters.status,
  );
  const hasAppliedFilters = Boolean(
    appliedFilters.patientQuery.trim() ||
      appliedFilters.doctorId ||
      appliedFilters.date ||
      appliedFilters.status,
  );
  const canClearFilters = hasDraftFilters || hasAppliedFilters;

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAppliedFilters({
      patientQuery: filters.patientQuery.trim(),
      doctorId: filters.doctorId,
      date: filters.date,
      status: filters.status,
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters(emptyAppointmentFilters);
    setAppliedFilters(emptyAppointmentFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (filter: ActiveFilterChip) => {
    const filterId = filter.id as keyof AppointmentFilters;

    setFilters((current) => ({ ...current, [filterId]: "" }));
    setAppliedFilters((current) => ({ ...current, [filterId]: "" }));
    setCurrentPage(1);
  };

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;

    setCancellingAppointmentId(appointmentToCancel.id);
    setError(null);

    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentToCancel.id, "cancelled");
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment,
        ),
      );
    } catch {
      setError("Não foi possível cancelar a consulta.");
    } finally {
      setCancellingAppointmentId(null);
      setAppointmentToCancel(null);
    }
  };

  const handleCompleteAppointment = async (appointmentToComplete: Appointment) => {
    setCompletingAppointmentId(appointmentToComplete.id);
    setError(null);

    try {
      const updatedAppointment = await updateAppointmentStatus(appointmentToComplete.id, "completed");
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment,
        ),
      );
    } catch {
      setError("Não foi possível marcar a consulta como realizada.");
    } finally {
      setCompletingAppointmentId(null);
    }
  };

  return (
    <div className="patients-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">Agendamentos</p>
          <h2 className="page-title">Consultas da clínica</h2>
          <p className="page-description">
            Encontre horários, acompanhe status e cancele consultas agendadas pela recepção.
          </p>
        </div>
        {canCreateAppointment && (
          <Link className="button primary" to="/appointments/new">
            <CalendarPlus size={18} aria-hidden="true" />
            Nova consulta
          </Link>
        )}
      </section>

      <CrudFilterSection
        title="Filtros da agenda"
        description="Busque por paciente, médico, data ou status."
        onSubmit={handleFilterSubmit}
        onClear={handleClearFilters}
        canClear={canClearFilters}
        disabled={isLoading}
      >
        <Input
          name="appointmentPatientFilter"
          label="Paciente"
          placeholder="Nome ou CPF"
          value={filters.patientQuery}
          onChange={(event) =>
            setFilters((current) => ({ ...current, patientQuery: event.target.value }))
          }
          autoComplete="off"
          disabled={isLoading}
        />

        <Select
          name="appointmentDoctorFilter"
          label="Médico"
          placeholder="Todos os médicos"
          value={filters.doctorId}
          onChange={(event) =>
            setFilters((current) => ({ ...current, doctorId: event.target.value }))
          }
          disabled={isLoading}
          options={doctors.map((doctor) => ({
            value: doctor.id,
            label: doctor.name,
          }))}
        />

        <Input
          type="date"
          name="appointmentDateFilter"
          label="Data"
          value={filters.date}
          onChange={(event) => setFilters((current) => ({ ...current, date: event.target.value }))}
          disabled={isLoading}
        />

        <Select
          name="appointmentStatusFilter"
          label="Status"
          placeholder="Todos os status"
          value={filters.status}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              status: event.target.value as AppointmentStatus | "",
            }))
          }
          disabled={isLoading}
          options={Object.entries(appointmentStatusLabel).map(([status, label]) => ({
            value: status,
            label,
          }))}
        />
      </CrudFilterSection>

      <ActiveFilterChips filters={activeFilters} onRemove={handleRemoveFilter} />

      <CrudTableSection
        title="Agenda cadastrada"
        description="Consultas mockadas e novos agendamentos salvos no navegador."
        summary={<span>{`${visibleAppointments.length} ${appointmentLabel}`}</span>}
      >
        <ConfirmDialog
          isOpen={appointmentToCancel !== null}
          title="Cancelar consulta"
          message="Confirma o cancelamento desta consulta? O horário ficará disponível para novo agendamento."
          confirmLabel="Cancelar consulta"
          cancelLabel="Voltar"
          variant="danger"
          onConfirm={handleConfirmCancel}
          onCancel={() => setAppointmentToCancel(null)}
        />

        {error && <p className="patient-feedback danger">{error}</p>}

        {isLoading ? (
          <div className="empty-state">
            <h3>Carregando consultas...</h3>
            <p>Buscando agenda, pacientes e médicos disponíveis.</p>
          </div>
        ) : visibleAppointments.length > 0 ? (
          <>
            <AppointmentTable
              appointments={paginatedAppointments}
              patients={patients}
              doctors={doctors}
              canEdit={canEditAppointments}
              canCancel={canEditAppointments}
              canComplete={canCompleteAppointments}
              cancellingAppointmentId={cancellingAppointmentId}
              completingAppointmentId={completingAppointmentId}
              onCancel={setAppointmentToCancel}
              onComplete={handleCompleteAppointment}
            />
            <CrudPagination
              currentPage={safeCurrentPage}
              totalItems={visibleAppointments.length}
              pageSize={appointmentPageSize}
              itemLabel={appointmentLabel}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="empty-state">
            <h3>Nenhuma consulta encontrada</h3>
            <p>Crie um novo agendamento ou ajuste os filtros da agenda.</p>
          </div>
        )}
      </CrudTableSection>
    </div>
  );
}
