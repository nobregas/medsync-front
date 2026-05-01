import { z } from "zod";

import { onlyDigits } from "@/lib/cpf";

import type { PatientFormData } from "./types";

export const healthInsuranceOptions = [
  "Particular",
  "Unimed",
  "Bradesco Saúde",
  "SulAmérica Saúde",
  "Amil",
  "Hapvida",
  "NotreDame Intermédica",
  "Porto Seguro Saúde",
  "Golden Cross",
  "Prevent Senior",
  "Cassi",
  "Geap",
] as const;

export const patientFormDefaultValues: PatientFormData = {
  fullName: "",
  birthDate: "",
  cpf: "",
  phone: "",
  healthInsurance: "",
};

export const patientSchema = z.object({
  fullName: z.string().trim().min(3, "Informe o nome completo."),
  birthDate: z
    .string()
    .min(1, "Informe a data de nascimento.")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
      message: "Informe uma data de nascimento válida.",
    })
    .refine((value) => value <= new Date().toISOString().split("T")[0], {
      message: "A data de nascimento não pode ser futura.",
    }),
  cpf: z
    .string()
    .min(1, "Informe o CPF do paciente.")
    .refine((value) => onlyDigits(value).length === 11, {
      message: "Informe um CPF no formato 000.000.000-00.",
    }),
  phone: z
    .string()
    .min(1, "Informe o telefone do paciente.")
    .refine((value) => {
      const digits = onlyDigits(value);
      return digits.length === 10 || digits.length === 11;
    }, "Informe um telefone válido."),
  healthInsurance: z.string().optional(),
});
