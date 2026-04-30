import type { Patient } from "@/features/patients/types";
import { patientsMock, getPatientById, searchPatients } from "@/features/patients/mock";

export async function getPatients(): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return patientsMock;
}

export async function getPatient(id: string): Promise<Patient | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return getPatientById(id) ?? null;
}

export async function searchPatientsByQuery(query: string): Promise<Patient[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return searchPatients(query);
}

export async function checkCpfExists(cpf: string, excludeId?: string): Promise<boolean> {
  const cleanCpf = cpf.replace(/\D/g, "");
  return patientsMock.some(
    (p) => p.cpf.replace(/\D/g, "") === cleanCpf && p.id !== excludeId,
  );
}

export async function createPatient(data: Omit<Patient, "id" | "createdAt" | "updatedAt">): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const exists = await checkCpfExists(data.cpf);
  if (exists) {
    throw new Error("CPF já cadastrado");
  }
  
  const now = new Date().toISOString().split("T")[0];
  const newPatient: Patient = {
    ...data,
    id: String(Date.now()),
    createdAt: now,
    updatedAt: now,
  };
  
  patientsMock.push(newPatient);
  return newPatient;
}

export async function updatePatient(id: string, data: Partial<Patient>): Promise<Patient> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = patientsMock.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Paciente não encontrado");
  }
  
  if (data.cpf) {
    const exists = await checkCpfExists(data.cpf, id);
    if (exists) {
      throw new Error("CPF já cadastrado");
    }
  }
  
  const updated = {
    ...patientsMock[index],
    ...data,
    updatedAt: new Date().toISOString().split("T")[0],
  };
  
  patientsMock[index] = updated;
  return updated;
}

export async function deletePatient(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const index = patientsMock.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Paciente não encontrado");
  }
  
  patientsMock.splice(index, 1);
}