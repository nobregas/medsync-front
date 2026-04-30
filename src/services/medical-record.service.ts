import type { MedicalRecord } from "@/features/medical-records/types";
import { medicalRecordsMock, getMedicalRecordsByPatient } from "@/features/medical-records/mock";

export async function getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return getMedicalRecordsByPatient(patientId);
}

export async function getMedicalRecord(id: string): Promise<MedicalRecord | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return medicalRecordsMock.find((r) => r.id === id) ?? null;
}

export async function createMedicalRecord(data: {
  patientId: string;
  appointmentId: string;
  mainComplaint: string;
  diagnosis: string;
  prescription: string;
  observations?: string;
}): Promise<MedicalRecord> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const newRecord: MedicalRecord = {
    ...data,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  
  medicalRecordsMock.push(newRecord);
  return newRecord;
}

export async function updateMedicalRecord(
  id: string, 
  data: Partial<Omit<MedicalRecord, "id" | "createdAt" | "patientId" | "appointmentId">>
): Promise<MedicalRecord> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = medicalRecordsMock.findIndex((r) => r.id === id);
  if (index === -1) {
    throw new Error("Prontuário não encontrado");
  }
  
  const updated = {
    ...medicalRecordsMock[index],
    ...data,
  };
  
  medicalRecordsMock[index] = updated;
  return updated;
}