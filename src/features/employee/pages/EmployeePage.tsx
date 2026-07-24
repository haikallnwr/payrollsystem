import { useState, useMemo } from "react";
import { useEmployeesQuery } from "../hooks/useEmployeesQuery";
import type { Employee } from "../employee.type";
import { EmployeeTable } from "../components/EmployeeTable";
import { EmployeeFilter } from "../components/EmployeeFilter";
import { EmployeeFormDialog } from "../components/EmployeeFormDialog";
import { EmployeeStatusDialog } from "../components/EmployeeStatusDialog";
import { UserFormDialog } from "@/features/user/components/UserFormDialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function EmployeePage() {
  const { user } = useAuth();
  const { data: employees = [], isLoading } = useEmployeesQuery();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Dialog States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_code.toLowerCase().includes(search.toLowerCase()) ||
        emp.position_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.division_name.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || emp.employment_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  // Statistics counters
  const activeCount = useMemo(
    () => employees.filter((e) => e.employment_status === "ACTIVE").length,
    [employees]
  );

  const resignedCount = useMemo(
    () => employees.filter((e) => e.employment_status === "RESIGNED").length,
    [employees]
  );

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleChangeStatus = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsStatusOpen(true);
  };

  const handleCreateUserAccount = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsUserFormOpen(true);
  };

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Employee Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your organization's workforce records, salaries, and employment status.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Summary Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Records</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{employees.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Active Staff</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{activeCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Resigned / Terminated</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{resignedCount}</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <EmployeeFilter
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Main Table */}
      <EmployeeTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onEdit={handleEdit}
        onChangeStatus={handleChangeStatus}
        onCreateUserAccount={canManage ? handleCreateUserAccount : undefined}
      />

      {/* Modals */}
      <EmployeeFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        employee={selectedEmployee}
      />

      <EmployeeStatusDialog
        open={isStatusOpen}
        onOpenChange={setIsStatusOpen}
        employee={selectedEmployee}
      />

      <UserFormDialog
        open={isUserFormOpen}
        onOpenChange={setIsUserFormOpen}
        defaultEmployeeId={selectedEmployee?.id}
      />
    </div>
  );
}
