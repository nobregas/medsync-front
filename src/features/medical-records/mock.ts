import type { MedicalRecord } from "./types";

export const medicalRecordsMock: MedicalRecord[] = [
  {
    id: "1",
    patientId: "1",
    appointmentId: "6",
    mainComplaint: "Dor de cabeça frequente",
    diagnosis: "Tensão muscular",
    prescription: "Dipirona 500mg - 1 comprimido em caso de dor. Repouso e hidratação.",
    observations: "Paciente relata estresse no trabalho.",
    createdAt: "2026-04-20T10:30:00",
  },
  {
    id: "2",
    patientId: "2",
    appointmentId: "7",
    mainComplaint: "Falta de ar ao subir escadas",
    diagnosis: "Sedentarismo",
    prescription: "Rotina de exercícios físicos. Retorno em 30 dias.",
    observations: "Exames de sangue solicitados.",
    createdAt: "2026-04-22T15:00:00",
  },
  {
    id: "3",
    patientId: "4",
    appointmentId: "9",
    mainComplaint: "Febre e dor de garganta",
    diagnosis: "Faringite viral",
    prescription: "Paracetamol 750mg - 3x ao dia por 5 dias. Hidratação.",
    createdAt: "2026-04-15T14:00:00",
  },
  {
    id: "4",
    patientId: "5",
    appointmentId: "10",
    mainComplaint: "Check-up anual",
    diagnosis: "Paciente saudável",
    prescription: "Nenhum medicamento necessário.",
    observations: "Exames de rotina dentro dos parâmetros normais.",
    createdAt: "2026-04-10T10:00:00",
  },
  {
    id: "5",
    patientId: "1",
    appointmentId: "1",
    mainComplaint: "Retorno para avaliação",
    diagnosis: "Melhora significativa",
    prescription: "Continuar com medicação anterior.",
    createdAt: "2026-04-29T09:00:00",
  },
];

export function getMedicalRecordsByPatient(patientId: string): MedicalRecord[] {
  return medicalRecordsMock
    .filter((r) => r.patientId === patientId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLatestMedicalRecord(patientId: string): MedicalRecord | undefined {
  const records = getMedicalRecordsByPatient(patientId);
  return records[0];
}