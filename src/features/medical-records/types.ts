export interface MedicalRecord {
  id: string;
  patientId: string;
  appointmentId: string;
  mainComplaint: string;
  diagnosis: string;
  prescription: string;
  observations?: string;
  createdAt: string;
}

export type MedicalRecordFormData = Omit<MedicalRecord, "id" | "createdAt">;