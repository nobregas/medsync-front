import type { Patient } from "@/features/patients/types";
import { patientsMock } from "@/features/patients/mock";

type PatientPayload = Omit<Patient, "id" | "createdAt" | "updatedAt">;

const STORAGE_KEY = "medsync:patients";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPatient(value: unknown): value is Patient {
  if (!value || typeof value !== "object") return false;

  const patient = value as Record<string, unknown>;

  return (
    typeof patient.id === "string" &&
    typeof patient.fullName === "string" &&
    typeof patient.birthDate === "string" &&
    typeof patient.cpf === "string" &&
    typeof patient.phone === "string" &&
    (patient.healthInsurance === undefined || typeof patient.healthInsurance === "string") &&
    typeof patient.createdAt === "string" &&
    typeof patient.updatedAt === "string"
  );
}

function persistPatients(patients: Patient[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}

function readPatients(): Patient[] {
  if (typeof window === "undefined") {
    return [...patientsMock];
  }

  const storedPatients = window.localStorage.getItem(STORAGE_KEY);

  if (!storedPatients) {
    persistPatients(patientsMock);
    return [...patientsMock];
  }

  try {
    const parsedPatients: unknown = JSON.parse(storedPatients);

    if (Array.isArray(parsedPatients) && parsedPatients.every(isPatient)) {
      return parsedPatients;
    }
  } catch {
    persistPatients(patientsMock);
  }

  persistPatients(patientsMock);
  return [...patientsMock];
}

export async function getPatients(): Promise<Patient[]> {
  await delay(300);
  return readPatients();
}

export async function getPatient(id: string): Promise<Patient | null> {
  await delay(200);
  return readPatients().find((patient) => patient.id === id) ?? null;
}

export async function searchPatientsByQuery(query: string): Promise<Patient[]> {
  await delay(300);

  const lowerQuery = query.toLowerCase();
  const queryDigits = query.replace(/\D/g, "");

  return readPatients().filter(
    (patient) =>
      patient.fullName.toLowerCase().includes(lowerQuery) ||
      (queryDigits.length > 0 && patient.cpf.replace(/\D/g, "").includes(queryDigits)),
  );
}

export async function checkCpfExists(cpf: string, excludeId?: string): Promise<boolean> {
  const cleanCpf = cpf.replace(/\D/g, "");
  return readPatients().some(
    (p) => p.cpf.replace(/\D/g, "") === cleanCpf && p.id !== excludeId,
  );
}

export async function createPatient(data: PatientPayload): Promise<Patient> {
  await delay(500);

  const exists = await checkCpfExists(data.cpf);
  if (exists) {
    throw new Error("CPF já cadastrado");
  }

  const now = new Date().toISOString().split("T")[0];
  const patients = readPatients();
  const newPatient: Patient = {
    ...data,
    id: String(Date.now()),
    createdAt: now,
    updatedAt: now,
  };

  persistPatients([...patients, newPatient]);
  return newPatient;
}

export async function updatePatient(id: string, data: Partial<PatientPayload>): Promise<Patient> {
  await delay(500);

  const patients = readPatients();
  const index = patients.findIndex((p) => p.id === id);
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
    ...patients[index],
    ...data,
    updatedAt: new Date().toISOString().split("T")[0],
  };

  const nextPatients = [...patients];
  nextPatients[index] = updated;
  persistPatients(nextPatients);
  return updated;
}

export async function deletePatient(id: string): Promise<void> {
  await delay(500);

  const patients = readPatients();
  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error("Paciente não encontrado");
  }

  persistPatients(patients.filter((patient) => patient.id !== id));
}
