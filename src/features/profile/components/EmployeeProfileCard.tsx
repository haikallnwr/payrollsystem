import type { ProfileUser } from "../profile.type";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Building2, Briefcase, User, Hash, AlertCircle } from "lucide-react";

interface EmployeeProfileCardProps {
  user: ProfileUser;
}

export function EmployeeProfileCard({ user }: EmployeeProfileCardProps) {
  const employee = user.employee;

  if (!employee) {
    return (
      <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 shadow-2xs">
        <CardContent className="p-6 flex items-start space-x-4">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Unlinked System User Account
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              This login account is a standalone administrative user. To link this account to a workforce staff record, edit this user in <strong>User Management</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <CardTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-slate-100">
          <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Workforce Profile Details</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Employee Code */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Hash className="w-3.5 h-3.5 text-slate-400" />
              <span>Employee Code</span>
            </span>
            <p className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100">
              {employee.employee_code}
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Name</span>
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {employee.full_name}
            </p>
          </div>

          {/* Job Position */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Position & Title</span>
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {employee.position_name}
            </p>
          </div>

          {/* Division */}
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Division / Department</span>
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {employee.division_name}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
