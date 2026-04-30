export type UserRole = "admin" | "doctor" | "receptionist";

export const permissions = {
  dashboard: ["admin", "doctor", "receptionist"],
  patientCreate: ["admin", "receptionist"],
  patientList: ["admin", "doctor", "receptionist"],
  patientEdit: ["admin", "receptionist"],
  appointmentCreate: ["admin", "receptionist"],
  appointmentList: ["admin", "doctor", "receptionist"],
  appointmentCalendar: ["admin", "doctor", "receptionist"],
  appointmentEdit: ["admin", "receptionist"],
  medicalRecordView: ["admin", "doctor"],
  medicalRecordCreate: ["admin", "doctor"],
  medicalRecordHistory: ["admin", "doctor"],
  userManagement: ["admin"],
} as const;

export function canAccess(
  userRole: UserRole,
  allowedRoles: readonly UserRole[],
) {
  return allowedRoles.includes(userRole);
}