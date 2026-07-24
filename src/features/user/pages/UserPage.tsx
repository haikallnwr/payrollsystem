import { useState, useMemo } from "react";
import { useUsersQuery } from "../hooks/useUsersQuery";
import { UserTable } from "../components/UserTable";
import { UserFormDialog } from "../components/UserFormDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Shield, Users, Search, ShieldCheck, UserCog } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export function UserPage() {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useUsersQuery();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Filter users by search term and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.employee?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.employee?.employee_code?.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // Statistics counters
  const adminCount = useMemo(() => users.filter((u) => u.role === "ADMIN").length, [users]);
  const hrCount = useMemo(() => users.filter((u) => u.role === "HR").length, [users]);
  const employeeUserCount = useMemo(() => users.filter((u) => u.role === "EMPLOYEE").length, [users]);

  const canManage = user?.role === "ADMIN" || user?.role === "HR";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            User Management & Access Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Register user credentials, assign system roles, and link login accounts to employee records.
          </p>
        </div>

        {canManage && (
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs shrink-0"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create User Account
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Total Accounts</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{users.length}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Admins</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{adminCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 rounded-lg">
            <UserCog className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">HR Managers</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{hrCount}</p>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">Employee Users</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{employeeUserCount}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search email, employee name, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All System Roles</SelectItem>
              <SelectItem value="ADMIN">ADMIN</SelectItem>
              <SelectItem value="HR">HR</SelectItem>
              <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Table */}
      <UserTable users={filteredUsers} isLoading={isLoading} />

      {/* Create Dialog */}
      <UserFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />
    </div>
  );
}
