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
            path: "employees",
            element: <EmployeePage />,
          },
          {
            path: "divisions",
            element: <DivisionPage />,
          },
          {
            path: "job-positions",
            element: <JobPositionPage />,
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
            element: <div className="p-6 font-medium text-slate-500">Payrolls Processing Page (Scaffold ready)</div>,
          },
          {
            path: "profile",
            element: <div className="p-6 font-medium text-slate-500">User Profile Settings Page (Scaffold ready)</div>,
          },
        ],
      },
    ],
  },
]);
