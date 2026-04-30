import type { UserRole } from "@/types/role";

export type DashboardMetric = {
  title: string;
  value: number | string;
  description?: string;
};

export type DashboardAppointment = {
  id: string;
  time: string;
  patient: string;
  doctor: string;
  status: "scheduled" | "completed" | "cancelled";
};

export type ReceptionistDashboardData = {
  metrics: DashboardMetric[];
  todayAppointments: DashboardAppointment[];
  monthAppointments: DashboardAppointment[];
};

export interface DashboardMetrics {
  totalPatients: number;
  totalAppointmentsToday: number;
  totalAppointmentsThisMonth: number;
  totalDoctors: number;
  totalUsers: number;
  completedAppointmentsThisMonth: number;
  scheduledAppointmentsThisMonth: number;
  cancelledAppointmentsThisMonth: number;
}

export function getMetricsByRole(role: UserRole): Partial<DashboardMetrics> {
  const baseMetrics: Partial<DashboardMetrics> = {};

  if (role === "admin") {
    baseMetrics.totalPatients = 5;
    baseMetrics.totalAppointmentsToday = 3;
    baseMetrics.totalAppointmentsThisMonth = 10;
    baseMetrics.totalDoctors = 3;
    baseMetrics.totalUsers = 6;
    baseMetrics.completedAppointmentsThisMonth = 4;
    baseMetrics.scheduledAppointmentsThisMonth = 4;
    baseMetrics.cancelledAppointmentsThisMonth = 2;
  }

  if (role === "doctor") {
    baseMetrics.totalAppointmentsToday = 2;
    baseMetrics.completedAppointmentsThisMonth = 3;
    baseMetrics.scheduledAppointmentsThisMonth = 4;
    baseMetrics.totalPatients = 5;
  }

  if (role === "receptionist") {
    baseMetrics.totalPatients = 5;
    baseMetrics.totalAppointmentsToday = 3;
    baseMetrics.totalAppointmentsThisMonth = 10;
    baseMetrics.totalDoctors = 3;
  }

  return baseMetrics;
}
