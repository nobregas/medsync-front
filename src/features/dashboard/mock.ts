import { getMetricsByRole } from "./types";
import type { UserRole } from "@/types/role";

export function getDashboardMetrics(role: UserRole) {
  return getMetricsByRole(role);
}