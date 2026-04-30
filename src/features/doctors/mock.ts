import type { Doctor } from "./types";

export const doctorsMock: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ana Martins",
    crm: "CRM-PB 12345",
    specialty: "Clínica Geral",
    email: "ana@medsync.com",
  },
  {
    id: "2",
    name: "Dr. Roberto Carlos",
    crm: "CRM-PB 23456",
    specialty: "Cardiologia",
    email: "roberto@medsync.com",
  },
  {
    id: "3",
    name: "Dra. Paula Ferreira",
    crm: "CRM-PB 34567",
    specialty: "Pediatria",
    email: "paula@medsync.com",
  },
];

export function getDoctorById(id: string): Doctor | undefined {
  return doctorsMock.find((d) => d.id === id);
}