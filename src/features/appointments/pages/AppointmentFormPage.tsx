import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock, Search, X } from "lucide-react";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Select } from "@/components/common/Select";
import { onlyDigits } from "@/lib/cpf";
import { formatDateToBr } from "@/lib/date";
import {
  createAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
} from "@/services/appointment.service";
import { getDoctors } from "@/services/doctor.service";
import { getPatients } from "@/services/patient.service";

import { AppointmentStatusBadge } from "../components/AppointmentStatusBadge";
import { appointmentFormDefaultValues, appointmentSchema, appointmentTimeOptions } from "../schemas";
import type { Doctor } from "@/features/doctors/types";
import type { Patient } from "@/features/patients/types";
import type { Appointment, AppointmentFormData } from "../types";

type AppointmentFormErrors = Partial<Record<keyof AppointmentFormData, string>>;

const appointmentFormId = "appointment-form";

function getPatientOptionLabel(patient: Patient) {
  return `${patient.fullName} - ${patient.cpf}`;
}

function findPatientName(patients: Patient[], patientId: string) {
  return patients.find((patient) => patient.id === patientId)?.fullName ?? "Paciente não encontrado";
}

function selectErrorId(fieldName: keyof AppointmentFormData, errors: AppointmentFormErrors) {
  return errors[fieldName] ? `${fieldName}-error` : undefined;
}

export function AppointmentFormPage() {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const isEditing = Boolean(appointmentId);
  const [formData, setFormData] = useState<AppointmentFormData>(appointmentFormDefaultValues);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientSearch, setPatientSearch] = useState("");
  const [errors, setErrors] = useState<AppointmentFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentAppointmentId = appointmentId;
    let isMounted = true;

    async function loadFormData() {
      try {
        const [patientData, doctorData, appointmentData, currentAppointment] = await Promise.all([
          getPatients(),
          getDoctors(),
          getAppointments(),
          currentAppointmentId ? getAppointment(currentAppointmentId) : Promise.resolve(null),
        ]);

        if (!isMounted) return;

        if (currentAppointmentId && !currentAppointment) {
          setLoadError("Consulta não encontrada.");
          return;
        }

        setPatients(patientData);
        setDoctors(doctorData);
        setAppointments(appointmentData);

        if (currentAppointment) {
          setFormData({
            patientId: currentAppointment.patientId,
            doctorId: currentAppointment.doctorId,
            date: currentAppointment.date,
            time: currentAppointment.time,
            notes: currentAppointment.notes ?? "",
          });
        }
      } catch {
        if (isMounted) {
          setLoadError("Não foi possível carregar os dados do agendamento.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadFormData();

    return () => {
      isMounted = false;
    };
  }, [appointmentId]);

  const selectedPatient = patients.find((patient) => patient.id === formData.patientId);
  const filteredPatients = patients.filter((patient) => {
    const query = patientSearch.trim().toLowerCase();
    const queryDigits = onlyDigits(patientSearch);

    if (!query && !queryDigits) return true;

    return (
      patient.fullName.toLowerCase().includes(query) ||
      (queryDigits.length > 0 && onlyDigits(patient.cpf).includes(queryDigits))
    );
  });
  const patientOptions =
    selectedPatient && !filteredPatients.some((patient) => patient.id === selectedPatient.id)
      ? [selectedPatient, ...filteredPatients]
      : filteredPatients;

  const occupiedAppointments = appointments
    .filter(
      (appointment) =>
        appointment.doctorId === formData.doctorId &&
        appointment.date === formData.date &&
        appointment.status !== "cancelled" &&
        appointment.id !== appointmentId,
    )
    .sort((first, second) => first.time.localeCompare(second.time));

  const selectedDoctor = doctors.find((doctor) => doctor.id === formData.doctorId);
  const selectedDateLabel = formData.date ? formatDateToBr(formData.date) : "data selecionada";

  const isTimeUnavailable = (time: string) => {
    return occupiedAppointments.some((appointment) => appointment.time === time);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const fieldName = event.target.name as keyof AppointmentFormData;

    setFormData((current) => ({ ...current, [fieldName]: event.target.value }));
    setErrors((current) => ({ ...current, [fieldName]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const result = appointmentSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        patientId: fieldErrors.patientId?.[0],
        doctorId: fieldErrors.doctorId?.[0],
        date: fieldErrors.date?.[0],
        time: fieldErrors.time?.[0],
        notes: fieldErrors.notes?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: AppointmentFormData = {
        ...result.data,
        notes: result.data.notes?.trim() || undefined,
      };

      if (appointmentId) {
        await updateAppointment(appointmentId, payload);
      } else {
        await createAppointment(payload);
      }

      navigate("/appointments");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível salvar a consulta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="patients-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">{isEditing ? "Reagendamento" : "Agendamento"}</p>
          <h2 className="page-title">{isEditing ? "Editar consulta" : "Nova consulta"}</h2>
          <p className="page-description">
            Localize o paciente, escolha o médico e confira os horários ocupados antes de salvar.
          </p>
        </div>
        <Link className="button secondary" to="/appointments">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </Link>
      </section>

      {isLoading ? (
        <section className="card patient-form-card">
          <div className="empty-state">
            <h3>Carregando agendamento...</h3>
            <p>Buscando pacientes, médicos e consultas já cadastradas.</p>
          </div>
        </section>
      ) : loadError ? (
        <section className="card patient-form-card">
          <div className="empty-state">
            <h3>{loadError}</h3>
            <p>Volte para a listagem e selecione outra consulta.</p>
          </div>
        </section>
      ) : (
        <div className="appointment-form-layout">
          <section className="card patient-form-card">
            <form id={appointmentFormId} className="patient-form" onSubmit={handleSubmit} noValidate>
              {formError && <p className="patient-feedback danger">{formError}</p>}

              <div className="patient-form-grid">
                <Input
                  name="patientSearch"
                  label="Buscar paciente"
                  placeholder="Digite nome ou CPF para filtrar a lista"
                  value={patientSearch}
                  onChange={(event) => setPatientSearch(event.target.value)}
                  autoComplete="off"
                  disabled={isSubmitting}
                />

                <Select
                  name="patientId"
                  label="Paciente"
                  placeholder="Selecione um paciente"
                  value={formData.patientId}
                  onChange={handleChange}
                  error={errors.patientId}
                  disabled={isSubmitting}
                  required
                  options={patientOptions.map((patient) => ({
                    value: patient.id,
                    label: getPatientOptionLabel(patient),
                  }))}
                />

                <Select
                  name="doctorId"
                  label="Médico"
                  placeholder="Selecione um médico"
                  value={formData.doctorId}
                  onChange={handleChange}
                  error={errors.doctorId}
                  disabled={isSubmitting}
                  required
                  options={doctors.map((doctor) => ({
                    value: doctor.id,
                    label: `${doctor.name} - ${doctor.specialty}`,
                  }))}
                />

                <Input
                  type="date"
                  name="date"
                  label="Data"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                  disabled={isSubmitting}
                  required
                />

                <Select
                  name="time"
                  label="Horário"
                  placeholder="Selecione um horário"
                  value={formData.time}
                  onChange={handleChange}
                  error={errors.time}
                  disabled={isSubmitting}
                  required
                  options={appointmentTimeOptions.map((time) => {
                    const unavailable = isTimeUnavailable(time);
                    return {
                      value: time,
                      label: unavailable ? `${time} - ocupado` : time,
                      disabled: unavailable,
                    };
                  })}
                />

                <div className="input-wrapper patient-form-field-wide">
                  <label className="input-label" htmlFor="notes">
                    Observações da recepção
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    className={`input-field appointment-notes ${errors.notes ? "input-error" : ""}`}
                    value={formData.notes ?? ""}
                    onChange={handleChange}
                    placeholder="Ex.: paciente solicitou encaixe, retorno ou aviso específico."
                    aria-invalid={errors.notes ? true : undefined}
                    aria-describedby={selectErrorId("notes", errors)}
                    disabled={isSubmitting}
                  />
                  {errors.notes && (
                    <p id={selectErrorId("notes", errors)} className="input-error-message">
                      {errors.notes}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </section>

          <aside className="card appointment-assist-card">
            <div className="section-header">
              <div>
                <h3 className="section-title">Checagem de horário</h3>
                <p className="section-description">
                  {selectedDoctor
                    ? `${selectedDoctor.name} em ${selectedDateLabel}`
                    : "Selecione médico e data para ver conflitos."}
                </p>
              </div>
              <Clock size={18} aria-hidden="true" />
            </div>

            {formData.doctorId && formData.date ? (
              occupiedAppointments.length > 0 ? (
                <div className="appointment-day-schedule">
                  {occupiedAppointments.map((appointment) => (
                    <div className="appointment-day-slot" key={appointment.id}>
                      <strong>{appointment.time}</strong>
                      <div>
                        <p>{findPatientName(patients, appointment.patientId)}</p>
                        <AppointmentStatusBadge status={appointment.status} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state appointment-assist-empty">
                  <h3>Sem conflito no dia</h3>
                  <p>Não há consultas ativas para este médico nessa data.</p>
                </div>
              )
            ) : (
              <div className="appointment-help-list">
                <p>
                  <Search size={16} aria-hidden="true" />
                  Busque o paciente por nome ou CPF.
                </p>
                <p>Escolha médico, data e horário para liberar a validação local.</p>
                <p>Consultas canceladas não bloqueiam o horário.</p>
              </div>
            )}
          </aside>
        </div>
      )}

      <div className="form-actions-bottom">
        <Button variant="secondary" onClick={() => navigate("/appointments")} disabled={isSubmitting}>
          <X size={16} aria-hidden="true" />
          Cancelar
        </Button>
        <Button
          type="submit"
          form={appointmentFormId}
          isLoading={isSubmitting}
          disabled={isLoading || Boolean(loadError)}
        >
          <Check size={16} aria-hidden="true" />
          {isEditing ? "Salvar alterações" : "Salvar consulta"}
        </Button>
      </div>
    </div>
  );
}
