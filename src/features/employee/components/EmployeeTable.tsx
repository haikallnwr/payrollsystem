import type { Employee } from "../employee.type";
import { EmployeeStatusBadge } from "./EmployeeStatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, RefreshCw, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  onEdit: (employee: Employee) => void;
  onChangeStatus: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  isLoading,
  onEdit,
  onChangeStatus,
}: EmployeeTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">No employees found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No employee records match your search criteria or directory is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-slate-50/80 dark:bg-slate-950/50">
          <TableRow>
            <TableHead className="w-28 text-xs font-bold uppercase tracking-wider">Code</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Employee</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Position & Division</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Join Date</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Base Salary</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Status</TableHead>
            <TableHead className="w-16 text-right text-xs font-bold uppercase tracking-wider"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
              {/* Employee Code */}
              <TableCell className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                {emp.employee_code}
              </TableCell>

              {/* Full Name & Phone */}
              <TableCell>
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {emp.full_name}
                </div>
                {emp.phone && (
                  <div className="text-xs text-slate-500 font-mono mt-0.5">{emp.phone}</div>
                )}
              </TableCell>

              {/* Position & Division */}
              <TableCell>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {emp.position_name} <span className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold">({emp.level})</span>
                </div>
                <div className="text-xs text-slate-500">{emp.division_name}</div>
              </TableCell>

              {/* Join Date */}
              <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                {formatDate(emp.join_date)}
              </TableCell>

              {/* Base Salary */}
              <TableCell className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(emp.base_salary)}
              </TableCell>

              {/* Status */}
              <TableCell>
                <EmployeeStatusBadge status={emp.employment_status} />
              </TableCell>

              {/* Actions Dropdown */}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">Employee Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(emp)}>
                      <Edit className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      <span>Edit Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onChangeStatus(emp)}>
                      <RefreshCw className="w-3.5 h-3.5 mr-2 text-slate-500" />
                      <span>Change Status</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
