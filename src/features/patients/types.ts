export interface Patient {
  id: string;
  fullName: string;
  birthDate: string;
  cpf: string;
  phone: string;
  healthInsurance?: string;
  createdAt: string;
  updatedAt: string;
}

export type PatientFormData = Omit<Patient, "id" | "createdAt" | "updatedAt">;