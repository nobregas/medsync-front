import type { Patient } from "./types";

export const patientsMock: Patient[] = [
  {
    id: "1",
    fullName: "Maria Souza",
    birthDate: "1990-04-12",
    cpf: "123.456.789-00",
    phone: "(83) 99999-0000",
    healthInsurance: "Unimed",
    createdAt: "2026-01-15",
    updatedAt: "2026-01-15",
  },
  {
    id: "2",
    fullName: "João Lima",
    birthDate: "1985-08-23",
    cpf: "234.567.890-11",
    phone: "(83) 98888-1111",
    healthInsurance: "Bradesco",
    createdAt: "2026-01-20",
    updatedAt: "2026-01-20",
  },
  {
    id: "3",
    fullName: "Pedro Santos",
    birthDate: "1978-12-05",
    cpf: "345.678.901-22",
    phone: "(83) 97777-2222",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-01",
  },
  {
    id: "4",
    fullName: "Ana Costa",
    birthDate: "1995-03-18",
    cpf: "456.789.012-33",
    phone: "(83) 96666-3333",
    healthInsurance: "SulAmérica",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-10",
  },
  {
    id: "5",
    fullName: "Lucas Oliveira",
    birthDate: "2000-07-30",
    cpf: "567.890.123-44",
    phone: "(83) 95555-4444",
    createdAt: "2026-02-15",
    updatedAt: "2026-02-15",
  },
];

export function getPatientById(id: string): Patient | undefined {
  return patientsMock.find((p) => p.id === id);
}

export function searchPatients(query: string): Patient[] {
  const lowerQuery = query.toLowerCase();
  return patientsMock.filter(
    (p) =>
      p.fullName.toLowerCase().includes(lowerQuery) ||
      p.cpf.replace(/\D/g, "").includes(query.replace(/\D/g, "")),
  );
}