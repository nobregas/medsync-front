import { z } from "zod";

import type { AppointmentFormData } from "./types";

export const appointmentTimeOptions = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
] as const;

export const appointmentFormDefaultValues: AppointmentFormData = {
  patientId: "",
  doctorId: "",
  date: "",
  time: "",
  notes: "",
};

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Selecione o paciente."),
  doctorId: z.string().min(1, "Selecione o médico."),
  date: z
    .string()
    .min(1, "Informe a data da consulta.")
    .refine((value) => !Number.isNaN(new Date(`${value}T00:00:00`).getTime()), {
      message: "Informe uma data válida.",
    }),
  time: z.string().min(1, "Selecione o horário."),
  notes: z.string().optional(),
});
