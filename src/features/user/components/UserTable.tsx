import type { UserItem } from "../user.type";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, ShieldAlert, User, CheckCircle2, XCircle } from "lucide-react";

interface UserTableProps {
  users: UserItem[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: UserTableProps) {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800 flex items-center space-x-1 w-fit">
            <ShieldAlert className="w-3 h-3 mr-1 text-purple-600 dark:text-purple-400" />
            <span>ADMIN</span>
          </Badge>
        );
      case "HR":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 flex items-center space-x-1 w-fit">
            <Shield className="w-3 h-3 mr-1 text-blue-600 dark:text-blue-400" />
            <span>HR</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 flex items-center space-x-1 w-fit">
            <User className="w-3 h-3 mr-1 text-slate-500" />
            <span>EMPLOYEE</span>
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500">Loading user accounts...</p>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <User className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No Users Found</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          No registered user accounts match your criteria. Create a new user account to grant login access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      <Table>
        <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
          <TableRow>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">User ID</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Account Email</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Role</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Linked Employee</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Department / Position</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Link Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              <TableCell className="font-mono text-xs font-semibold text-slate-500">
                #{user.id}
              </TableCell>
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                {user.email}
              </TableCell>
              <TableCell>{getRoleBadge(user.role)}</TableCell>
              <TableCell>
                {user.employee ? (
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 block">
                      {user.employee.full_name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {user.employee.employee_code}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs italic text-slate-400">Unlinked (System User)</span>
                )}
              </TableCell>
              <TableCell>
                {user.employee ? (
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {user.employee.position_name}
                    </span>
                    <span className="block text-[11px] text-slate-400">
                      {user.employee.division_name}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </TableCell>
              <TableCell>
                {user.employee ? (
                  <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Linked</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                    <XCircle className="w-4 h-4" />
                    <span>Standalone</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
