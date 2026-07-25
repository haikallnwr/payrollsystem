import type { ProfileUser } from "../profile.type";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Mail, Key, UserCheck, CheckCircle2, Clock } from "lucide-react";

interface AccountDetailsCardProps {
  user: ProfileUser;
}

export function AccountDetailsCard({ user }: AccountDetailsCardProps) {
  const getRoleDescription = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Full administrative privileges: manage employees, users, divisions, job positions, overtimes, reimbursements, and payroll generation.";
      case "HR":
        return "Human resources management: manage employees, approve reimbursements, review overtimes, and generate monthly payroll records.";
      default:
        return "Standard employee access: view individual payslips, submit overtime requests, and track reimbursement claims.";
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <CardTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <ShieldCheck className="w-5 h-5 text-slate-600 dark:text-blue-400" />
          <span>System Account & Security Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User ID */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              User ID
            </span>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">
              #{user.id}
            </p>
          </div>

          {/* Account Email */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </span>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user.email}
              </p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Active
              </span>
            </div>
          </div>

          {/* System Role */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Assigned System Role</span>
            </span>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {user.role}
            </p>
          </div>

          {/* Authentication Type */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-slate-400" />
              <span>Session Security</span>
            </span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Encrypted JWT Cookie (HttpOnly)
            </p>
          </div>
        </div>

        {/* Access Privileges Notice */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Role Privileges Scope</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {getRoleDescription(user.role)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
