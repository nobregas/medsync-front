import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, X, Check } from "lucide-react";

import { Button } from "@/components/common/Button";

import {
  checkCpfExists,
  createPatient,
  getPatient,
  updatePatient,
} from "@/services/patient.service";

import { PatientForm } from "../components/PatientForm";
import type { PatientFormData } from "../types";

export function PatientFormPage() {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const isEditing = Boolean(patientId);
  const [initialData, setInitialData] = useState<PatientFormData | undefined>();
  const [isLoading, setIsLoading] = useState(isEditing);
  const [loadError, setLoadError] = useState<string | null>(null);
  const formRef = useRef<{ submit: () => void }>(null);

  useEffect(() => {
    if (!patientId) return;

    const currentPatientId = patientId;
    let isMounted = true;

    async function loadPatient() {
      try {
        const patient = await getPatient(currentPatientId);

        if (!isMounted) return;

        if (!patient) {
          setLoadError("Paciente não encontrado.");
          return;
        }

        setInitialData({
          fullName: patient.fullName,
          birthDate: patient.birthDate,
          cpf: patient.cpf,
          phone: patient.phone,
          healthInsurance: patient.healthInsurance,
        });
      } catch {
        if (isMounted) {
          setLoadError("Não foi possível carregar os dados do paciente.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPatient();

    return () => {
      isMounted = false;
    };
  }, [patientId]);

  const handleSubmit = async (data: PatientFormData) => {
    if (patientId) {
      await updatePatient(patientId, data);
      return;
    }

    await createPatient(data);
  };

  const handleCpfUniqueValidation = (cpf: string) => {
    return checkCpfExists(cpf, patientId);
  };

  return (
    <div className="patients-page">
      <section className="page-header">
        <div>
          <p className="eyebrow">{isEditing ? "Edição" : "Cadastro"}</p>
          <h2 className="page-title">{isEditing ? "Editar paciente" : "Novo paciente"}</h2>
          <p className="page-description">
            Preencha os dados básicos do paciente para manter o cadastro da recepção atualizado.
          </p>
        </div>
        <Link className="button secondary" to="/patients">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar
        </Link>
      </section>

      <section className="card patient-form-card">
        {isLoading ? (
          <div className="empty-state">
            <h3>Carregando paciente...</h3>
            <p>Buscando informações para edição.</p>
          </div>
        ) : loadError ? (
          <div className="empty-state">
            <h3>{loadError}</h3>
            <p>Volte para a listagem e selecione outro paciente.</p>
          </div>
        ) : (
          <PatientForm
            ref={formRef}
            key={patientId ?? "new"}
            initialData={initialData}
            submitLabel={isEditing ? "Salvar alterações" : "Salvar paciente"}
            onSubmit={handleSubmit}
            onSuccess={() => navigate("/patients")}
            onCancel={() => navigate("/patients")}
            validateCpfUnique={handleCpfUniqueValidation}
            showActions={false}
          />
        )}
      </section>

      <div className="form-actions-bottom">
        <Button variant="secondary" onClick={() => navigate("/patients")}>
          <X size={16} aria-hidden="true" />
          Cancelar
        </Button>
        <Button onClick={() => formRef.current?.submit()}>
          <Check size={16} aria-hidden="true" />
          Salvar
        </Button>
      </div>
    </div>
  );
}
