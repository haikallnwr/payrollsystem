import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { AuthLayout } from "@/layouts/AuthLayout";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { EmployeePage } from "@/features/employee";
import { DivisionPage } from "@/features/division";
import { JobPositionPage } from "@/features/job-position";
import { ReimbursementPage } from "@/features/reimbursement";
import { OvertimePage } from "@/features/overtime";
import { PayrollPage } from "@/features/payroll";

import { UserPage } from "@/features/user";
import { ProfilePage } from "@/features/profile";
import { RoleGuard } from "@/routes/RoleGuard";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "users",
            element: (
              <RoleGuard allowedRoles={["ADMIN"]}>
                <UserPage />
              </RoleGuard>
            ),
          },
          {
            path: "employees",
            element: (
              <RoleGuard allowedRoles={["ADMIN", "HR"]}>
                <EmployeePage />
              </RoleGuard>
            ),
          },
          {
            path: "divisions",
            element: (
              <RoleGuard allowedRoles={["ADMIN"]}>
                <DivisionPage />
              </RoleGuard>
            ),
          },
          {
            path: "job-positions",
            element: (
              <RoleGuard allowedRoles={["ADMIN"]}>
                <JobPositionPage />
              </RoleGuard>
            ),
          },
          {
            path: "reimbursements",
            element: <ReimbursementPage />,
          },
          {
            path: "overtimes",
            element: <OvertimePage />,
          },
          {
            path: "payrolls",
            element: <PayrollPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
