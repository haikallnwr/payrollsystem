import { useAuth } from "@/providers/auth-provider";
import { ProfileHeaderCard } from "../components/ProfileHeaderCard";
import { EmployeeProfileCard } from "../components/EmployeeProfileCard";
import { AccountDetailsCard } from "../components/AccountDetailsCard";
import { Button } from "@/components/ui/button";
import { LogOut, Banknote, Receipt, Clock, UserCheck } from "lucide-react";
import { useNavigate } from "react-router";

export function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
        <p className="mt-2 text-sm text-slate-500">Loading user profile details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500">User session not found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-slate-600 dark:text-blue-400" />
            <span>My User Profile</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View your system credentials, assigned role permissions, and workforce record.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={logout}
          className="text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 shrink-0 font-medium"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* Main Profile Header Banner */}
      <ProfileHeaderCard user={user} />

      {/* Quick Navigation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => navigate("/payrolls")}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-zinc-400 dark:hover:border-blue-500 transition-all text-left group shadow-2xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-105 transition-transform">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Payroll Records</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                View Slips & Earnings
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/reimbursements")}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-zinc-400 dark:hover:border-blue-500 transition-all text-left group shadow-2xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-lg group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Reimbursements</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Claims & Business Expenses
              </p>
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate("/overtimes")}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-zinc-400 dark:hover:border-blue-500 transition-all text-left group shadow-2xs"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-lg group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400">Overtime Log</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Extra Hours History
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Profile Details Sections */}
      <div className="space-y-6">
        <EmployeeProfileCard user={user} />
        <AccountDetailsCard user={user} />
      </div>
    </div>
  );
}
