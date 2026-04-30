import { getMetricsByRole } from "./types";
import type { UserRole } from "@/types/role";
import type { ReceptionistDashboardData } from "./types";

export const receptionistDashboardMock: ReceptionistDashboardData = {
  metrics: [
    {
      title: "Consultas hoje",
      value: 5,
      description: "Agendadas para 29/04/2026",
    },
    {
      title: "Pacientes cadastrados",
      value: 12,
      description: "Total no sistema",
    },
    {
      title: "Consultas este mês",
      value: 15,
      description: "Total de agendamentos em abril",
    },
    {
      title: "Médicos disponíveis",
      value: 3,
      description: "Profissionais cadastrados",
    },
  ],
  todayAppointments: [
    {
      id: "1",
      time: "09:00",
      patient: "João Silva",
      doctor: "Dr. Carlos Pereira",
      status: "scheduled",
    },
    {
      id: "2",
      time: "10:00",
      patient: "Maria Santos",
      doctor: "Dra. Fernanda Lima",
      status: "scheduled",
    },
    {
      id: "3",
      time: "14:00",
      patient: "Pedro Oliveira",
      doctor: "Dr. Roberto Alves",
      status: "scheduled",
    },
    {
      id: "4",
      time: "15:00",
      patient: "Ana Costa",
      doctor: "Dr. Carlos Pereira",
      status: "scheduled",
    },
    {
      id: "5",
      time: "16:30",
      patient: "Lucas Rodrigues",
      doctor: "Dra. Fernanda Lima",
      status: "scheduled",
    },
  ],
  monthAppointments: [
    {
      id: "6",
      time: "09:00",
      patient: "Carlos Mendes",
      doctor: "Dr. Carlos Pereira",
      status: "scheduled",
    },
    {
      id: "7",
      time: "10:00",
      patient: "Fernanda Souza",
      doctor: "Dr. Roberto Alves",
      status: "scheduled",
    },
    {
      id: "8",
      time: "14:00",
      patient: "Ricardo Lima",
      doctor: "Dr. Carlos Pereira",
      status: "completed",
    },
    {
      id: "9",
      time: "15:00",
      patient: "Patricia Dias",
      doctor: "Dra. Fernanda Lima",
      status: "completed",
    },
    {
      id: "10",
      time: "16:00",
      patient: "Marcos André",
      doctor: "Dr. Roberto Alves",
      status: "scheduled",
    },
    {
      id: "11",
      time: "09:00",
      patient: "Renata Costa",
      doctor: "Dr. Carlos Pereira",
      status: "cancelled",
    },
    {
      id: "12",
      time: "11:00",
      patient: "André Santos",
      doctor: "Dr. Roberto Alves",
      status: "scheduled",
    },
  ],
};

export function getDashboardMetrics(role: UserRole) {
  return getMetricsByRole(role);
}
