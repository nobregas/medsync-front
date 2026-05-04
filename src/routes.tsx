import type { ReactNode } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AppLayout } from "./components/layout/AppLayout";
import { AppointmentFormPage } from "./features/appointments/pages/AppointmentFormPage";
import { AppointmentListPage } from "./features/appointments/pages/AppointmentListPage";
import { CalendarPage } from "./features/appointments/pages/CalendarPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { PatientFormPage } from "./features/patients/pages/PatientFormPage";
import { PatientListPage } from "./features/patients/pages/PatientListPage";
import { useAuth } from "./hooks/useAuth";
import { canAccess, permissions } from "./types/role";
import type { UserRole } from "./types/role";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: readonly UserRole[];
};

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !canAccess(user.role, allowedRoles))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientListPage />} />
        <Route path="/patients/new" element={<PatientFormPage />} />
        <Route path="/patients/:patientId/edit" element={<PatientFormPage />} />
        <Route path="/appointments" element={<AppointmentListPage />} />
        <Route
          path="/appointments/new"
          element={
            <ProtectedRoute allowedRoles={permissions.appointmentCreate}>
              <AppointmentFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:appointmentId/edit"
          element={
            <ProtectedRoute allowedRoles={permissions.appointmentEdit}>
              <AppointmentFormPage />
            </ProtectedRoute>
          }
        />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
