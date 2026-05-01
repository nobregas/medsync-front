import { useState, type ChangeEvent, type FormEvent } from "react";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { formatCpf } from "@/lib/cpf";
import { formatPhone } from "@/lib/formatters";

import { healthInsuranceOptions, patientFormDefaultValues, patientSchema } from "../schemas";
import type { PatientFormData } from "../types";

type PatientFormErrors = Partial<Record<keyof PatientFormData, string>>;

type PatientFormProps = {
  initialData?: PatientFormData;
  submitLabel: string;
  onSubmit: (data: PatientFormData) => Promise<void>;
  onSuccess: () => void;
  onCancel: () => void;
  validateCpfUnique: (cpf: string) => Promise<boolean>;
};

function getInitialData(initialData?: PatientFormData): PatientFormData {
  return {
    ...patientFormDefaultValues,
    ...initialData,
    healthInsurance: initialData?.healthInsurance ?? "",
  };
}

export function PatientForm({
  initialData,
  submitLabel,
  onSubmit,
  onSuccess,
  onCancel,
  validateCpfUnique,
}: PatientFormProps) {
  const [formData, setFormData] = useState<PatientFormData>(() => getInitialData(initialData));
  const [errors, setErrors] = useState<PatientFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const fieldName = event.target.name as keyof PatientFormData;
    let nextValue = event.target.value;

    if (fieldName === "cpf") {
      nextValue = formatCpf(nextValue);
    }

    if (fieldName === "phone") {
      nextValue = formatPhone(nextValue);
    }

    setFormData((current) => ({ ...current, [fieldName]: nextValue }));
    setErrors((current) => ({ ...current, [fieldName]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const result = patientSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        fullName: fieldErrors.fullName?.[0],
        birthDate: fieldErrors.birthDate?.[0],
        cpf: fieldErrors.cpf?.[0],
        phone: fieldErrors.phone?.[0],
        healthInsurance: fieldErrors.healthInsurance?.[0],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cpfAlreadyExists = await validateCpfUnique(result.data.cpf);

      if (cpfAlreadyExists) {
        setErrors((current) => ({ ...current, cpf: "Este CPF já está cadastrado." }));
        setIsSubmitting(false);
        return;
      }

      await onSubmit({
        ...result.data,
        healthInsurance: result.data.healthInsurance || undefined,
      });

      setIsSubmitting(false);
      onSuccess();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Não foi possível salvar o paciente.");
      setIsSubmitting(false);
    }
  };

  const selectErrorId = errors.healthInsurance ? "healthInsurance-error" : undefined;

  return (
    <form className="patient-form" onSubmit={handleSubmit} noValidate>
      {formError && <p className="patient-feedback danger">{formError}</p>}

      <div className="patient-form-grid">
        <Input
          name="fullName"
          label="Nome completo"
          placeholder="Ex.: Maria Souza"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          autoComplete="name"
          disabled={isSubmitting}
          required
        />

        <Input
          type="date"
          name="birthDate"
          label="Data de nascimento"
          value={formData.birthDate}
          onChange={handleChange}
          error={errors.birthDate}
          disabled={isSubmitting}
          required
        />

        <Input
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          value={formData.cpf}
          onChange={handleChange}
          error={errors.cpf}
          inputMode="numeric"
          maxLength={14}
          disabled={isSubmitting}
          required
        />

        <Input
          name="phone"
          label="Telefone"
          placeholder="(11) 99999-9999"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          inputMode="tel"
          maxLength={15}
          autoComplete="tel"
          disabled={isSubmitting}
          required
        />

        <div className="input-wrapper patient-form-field-wide">
          <label className="input-label" htmlFor="healthInsurance">
            Convênio
          </label>
          <select
            id="healthInsurance"
            name="healthInsurance"
            className={`input-field ${errors.healthInsurance ? "input-error" : ""}`}
            value={formData.healthInsurance ?? ""}
            onChange={handleChange}
            aria-invalid={errors.healthInsurance ? true : undefined}
            aria-describedby={selectErrorId}
            disabled={isSubmitting}
          >
            <option value="">Sem convênio informado</option>
            {healthInsuranceOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.healthInsurance && (
            <p id={selectErrorId} className="input-error-message">
              {errors.healthInsurance}
            </p>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
