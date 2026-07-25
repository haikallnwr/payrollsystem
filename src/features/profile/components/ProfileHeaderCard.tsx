import type { ProfileUser } from "../profile.type";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, User, CheckCircle2, Building2, Briefcase } from "lucide-react";

interface ProfileHeaderCardProps {
  user: ProfileUser;
}

export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-white/15 border-white/15 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-white" />
            <span>ADMINISTRATOR</span>
          </Badge>
        );
      case "HR":
        return (
          <Badge className="bg-white/15 border-white/15 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <Shield className="w-3.5 h-3.5 mr-1 text-white" />
            <span>HUMAN RESOURCES</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-white/15 border-white/15 text-white flex items-center space-x-1 w-fit font-semibold shadow-xs">
            <User className="w-3.5 h-3.5 mr-1 text-white" />
            <span>EMPLOYEE</span>
          </Badge>
        );
    }
  };

  const displayName = user.employee?.full_name || user.email.split("@")[0];

  return (
    <div className="bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 dark:from-slate-950 dark:via-emerald-950/60 dark:to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
      {/* Subtle background glow decorative circle */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        {/* Avatar */}
        <Avatar className="h-24 w-24 border-4 border-white/10 shadow-lg bg-emerald-800 text-white text-2xl font-bold shrink-0">
          <AvatarFallback className="bg-emerald-800 text-white">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="space-y-2 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {displayName}
              </h2>
              <p className="text-sm text-slate-300 font-mono mt-0.5">{user.email}</p>
            </div>
            <div>{getRoleBadge(user.role)}</div>
          </div>

          {user.employee && (
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Briefcase className="w-4 h-4 text-white-400" />
                <span>{user.employee.position_name}</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md">
                <Building2 className="w-4 h-4 text-white-400" />
                <span>{user.employee.division_name}</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md font-mono">
                <CheckCircle2 className="w-4 h-4 text-white-400" />
                <span>ID: {user.employee.employee_code}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
